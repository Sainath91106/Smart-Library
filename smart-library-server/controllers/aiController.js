const axios = require('axios');
const OpenAI = require('openai');
const Book = require('../models/Book');

const DEFAULT_GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];

/**
 * Get OpenAI client instance (lazy initialization)
 */
const getOpenAIClient = (apiKey) => {
  return new OpenAI({
    apiKey,
  });
};

const getAIProvider = () => {
  const openAIKey = process.env.OPENAI_API_KEY;

  // Some setups may accidentally store Gemini key in OPENAI_API_KEY.
  const geminiKeyFromOpenAIField =
    openAIKey && openAIKey.startsWith('AIza') ? openAIKey : '';
  const geminiKey = process.env.GEMINI_API_KEY || geminiKeyFromOpenAIField;

  if (openAIKey && !openAIKey.startsWith('AIza')) {
    return { provider: 'openai', apiKey: openAIKey };
  }

  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey };
  }

  return { provider: null, apiKey: null };
};

const getProviderErrorDetails = (error) => {
  return (
    error?.providerDetails ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    ''
  );
};

const isQuotaExceededError = (error) => {
  const status = error?.status || error?.response?.status;
  const details = getProviderErrorDetails(error);
  if (status !== 429) {
    return false;
  }
  return /quota exceeded|rate limit|free_tier|limit:\s*0/i.test(details);
};

const createLocalSummary = (book) => {
  const title = book?.title || 'This book';
  const author = book?.author || 'the author';
  const category = book?.category || 'General';
  const description = (book?.description || '').trim();

  const cleanDescription = description.replace(/\s+/g, ' ');
  const truncated =
    cleanDescription.length > 240 ? `${cleanDescription.slice(0, 237).trim()}...` : cleanDescription;

  const opening = `"${title}" by ${author} is a ${category} title.`;
  const middle = truncated || 'It offers a focused reading experience suited to library patrons.';
  const closing = 'Recommended for readers exploring this category and related topics.';

  return `${opening}\n${middle}\n${closing}`;
};

const getGeminiModels = () => {
  const configuredList = process.env.GEMINI_MODELS;
  const configuredSingle = process.env.GEMINI_MODEL;

  const models = [];

  if (configuredSingle && configuredSingle.trim()) {
    models.push(configuredSingle.trim());
  }

  if (configuredList && configuredList.trim()) {
    configuredList
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)
      .forEach((m) => models.push(m));
  }

  DEFAULT_GEMINI_MODELS.forEach((model) => {
    if (!models.includes(model)) {
      models.push(model);
    }
  });

  return models;
};

const generateWithOpenAI = async (apiKey, prompt) => {
  const openai = getOpenAIClient(apiKey);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional librarian who writes clear, concise book summaries for library catalogs.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content?.trim();
};

const generateWithGemini = async (apiKey, prompt) => {
  const modelsToTry = getGeminiModels();
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        },
        {
          timeout: 30000,
        }
      );

      const parts = response.data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .map((part) => part.text || '')
        .join(' ')
        .trim();

      if (text) {
        return text;
      }
    } catch (error) {
      const status = error?.response?.status;
      const details = getProviderErrorDetails(error);
      const modelRelatedFailure =
        status === 404 ||
        (status === 400 && /model|not found|not available|unsupported|does not exist/i.test(details));

      lastError = error;

      // If model name/version is the only problem, try the next candidate model.
      if (modelRelatedFailure) {
        continue;
      }

      throw error;
    }
  }

  const aggregateError = new Error(
    `Gemini model resolution failed. Tried models: ${modelsToTry.join(', ')}`
  );
  aggregateError.status = lastError?.response?.status || 500;
  aggregateError.providerDetails = getProviderErrorDetails(lastError);
  aggregateError.code = lastError?.code;
  throw aggregateError;
};

/**
 * Generate AI summary for a book
 * POST /api/ai/summary
 * Body: { bookId }
 */
const generateSummary = async (req, res) => {
  try {
    const { bookId } = req.body;
    const { provider, apiKey } = getAIProvider();

    // Validate input
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    if (!provider || !apiKey) {
      return res.status(500).json({
        message: 'AI provider API key is not configured.',
        details: 'Set OPENAI_API_KEY or GEMINI_API_KEY in smart-library-server/.env',
      });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // If summary already exists, return it (optimization)
    if (book.aiSummary && book.aiSummary.trim() !== '') {
      return res.status(200).json({
        summary: book.aiSummary,
        cached: true,
        message: 'Summary retrieved from cache',
      });
    }

    // Prepare prompt for OpenAI
    const prompt = `You are a professional librarian writing book summaries for a library catalog. 
    
Book Title: "${book.title}"
Author: "${book.author}"
Category: ${book.category}
Description: ${book.description || 'No description available'}

Please provide a concise, engaging 3-5 line summary of this book that would help library patrons understand what the book is about and decide if they want to read it. Write in a clear, professional library style.`;

    let generatedSummary;
    let usedFallback = false;

    // Call selected AI provider
    try {
      generatedSummary =
        provider === 'openai'
          ? await generateWithOpenAI(apiKey, prompt)
          : await generateWithGemini(apiKey, prompt);
    } catch (providerError) {
      if (isQuotaExceededError(providerError)) {
        generatedSummary = createLocalSummary(book);
        usedFallback = true;
      } else {
        throw providerError;
      }
    }

    if (!generatedSummary) {
      return res.status(500).json({ message: 'Failed to generate summary' });
    }

    // Save the summary to the database
    book.aiSummary = generatedSummary;
    await book.save();

    return res.status(200).json({
      summary: generatedSummary,
      cached: false,
      provider: usedFallback ? 'local-fallback' : provider,
      fallback: usedFallback,
      message: usedFallback
        ? 'AI quota exceeded. Generated a local summary fallback.'
        : 'Summary generated successfully',
    });
  } catch (error) {
    console.error('AI Summary Error:', error);

    const status = error.status || error.response?.status;
    const providerDetails = getProviderErrorDetails(error);

    // Handle provider-specific errors
    if (status === 401 || status === 403) {
      return res.status(500).json({
        message: 'AI API authentication failed. Please check your API key.',
        details: providerDetails || 'The API key may be invalid, expired, or missing permissions.',
      });
    }

    if (status === 429) {
      return res.status(429).json({
        message: 'AI API rate limit exceeded.',
        details:
          providerDetails ||
          'Please wait a minute and try again. If this persists, check quota/billing for your provider.',
        retryAfter: 60,
      });
    }

    if (status === 402) {
      return res.status(402).json({
        message: 'AI API billing issue.',
        details: providerDetails || 'Your provider account may be out of credits or billing is not enabled.',
      });
    }

    if (status === 503) {
      return res.status(503).json({
        message: 'AI service temporarily unavailable.',
        details: providerDetails || 'The AI provider is experiencing issues. Please try again in a few minutes.',
      });
    }

    if (!status && error.code && ['ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'].includes(error.code)) {
      return res.status(503).json({
        message: 'AI provider network error.',
        details: providerDetails || 'Could not reach the AI provider. Check internet access and retry.',
        errorCode: error.code,
      });
    }

    if (status === 400) {
      return res.status(500).json({
        message: 'AI request was rejected by provider.',
        details: providerDetails || 'The provider rejected this request. Verify model/key configuration.',
      });
    }

    return res.status(500).json({
      message: 'Failed to generate AI summary',
      error: error.message,
      details: providerDetails || 'An unexpected error occurred while generating the summary.',
    });
  }
};

module.exports = { generateSummary };
