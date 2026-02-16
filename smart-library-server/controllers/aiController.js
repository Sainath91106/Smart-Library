const OpenAI = require('openai');
const Book = require('../models/Book');

/**
 * Get OpenAI client instance (lazy initialization)
 */
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

/**
 * Generate AI summary for a book
 * POST /api/ai/summary
 * Body: { bookId }
 */
const generateSummary = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Validate input
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
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

    // Initialize OpenAI client
    const openai = getOpenAIClient();

    // Prepare prompt for OpenAI
    const prompt = `You are a professional librarian writing book summaries for a library catalog. 
    
Book Title: "${book.title}"
Author: "${book.author}"
Category: ${book.category}
Description: ${book.description || 'No description available'}

Please provide a concise, engaging 3-5 line summary of this book that would help library patrons understand what the book is about and decide if they want to read it. Write in a clear, professional library style.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional librarian who writes clear, concise book summaries for library catalogs.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    // Extract the generated summary
    const generatedSummary = completion.choices[0]?.message?.content?.trim();

    if (!generatedSummary) {
      return res.status(500).json({ message: 'Failed to generate summary' });
    }

    // Save the summary to the database
    book.aiSummary = generatedSummary;
    await book.save();

    return res.status(200).json({
      summary: generatedSummary,
      cached: false,
      message: 'Summary generated successfully',
    });
  } catch (error) {
    console.error('AI Summary Error:', error);
    
    // Handle OpenAI specific errors
    if (error.status === 401) {
      return res.status(500).json({ 
        message: 'OpenAI API authentication failed. Please check your API key.',
        details: 'The API key may be invalid or expired.'
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        message: 'OpenAI API rate limit exceeded.',
        details: 'This usually happens due to: 1) Free tier limits (3 requests/min), 2) No billing credits, or 3) Expired trial. Please wait a minute and try again, or upgrade your OpenAI plan.',
        retryAfter: 60
      });
    }
    
    if (error.status === 402) {
      return res.status(402).json({ 
        message: 'OpenAI API billing issue.',
        details: 'Your OpenAI account may be out of credits. Please add payment method at platform.openai.com/billing'
      });
    }
    
    if (error.status === 503) {
      return res.status(503).json({ 
        message: 'OpenAI service temporarily unavailable.',
        details: 'The OpenAI API is experiencing issues. Please try again in a few minutes.'
      });
    }
    
    return res.status(500).json({ 
      message: 'Failed to generate AI summary', 
      error: error.message,
      details: 'An unexpected error occurred while generating the summary.'
    });
  }
};

module.exports = { generateSummary };
