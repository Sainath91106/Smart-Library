require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const connectDB = require('./config/db');
const Book = require('./models/Book');

// Different categories to get variety
const bookCategories = [
  'programming',
  'javascript',
  'python',
  'react',
  'nodejs',
  'artificial intelligence',
  'data science',
  'web development',
  'algorithms',
  'databases'
];

const fetchBooksFromCategory = async (category, maxResults = 10) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(category)}&maxResults=${maxResults}&orderBy=relevance`
    );

    if (!response.data.items) {
      return [];
    }

    return response.data.items.map((item) => ({
      title: item.volumeInfo.title || 'Unknown Title',
      author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
      category: item.volumeInfo.categories?.[0] || category,
      description: item.volumeInfo.description || 'No description available.',
      coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
      totalCopies: Math.floor(Math.random() * 5) + 3, // 3-7 copies
      availableCopies: Math.floor(Math.random() * 5) + 3,
      isActive: true,
    }));
  } catch (error) {
    console.error(`❌ Error fetching ${category}:`, error.message);
    return [];
  }
};

const seedBooks = async () => {
  try {
    await connectDB();

    // Check if books already exist
    const existingCount = await Book.countDocuments();
    if (existingCount > 0) {
      console.log(`📚 Found ${existingCount} existing books in database.`);
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('⚠️  Do you want to clear existing books and reseed? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          await Book.deleteMany({});
          console.log('🗑️  Cleared existing books.');
          rl.close();
          await performSeeding();
        } else {
          console.log('✅ Keeping existing books. Exiting...');
          rl.close();
          process.exit(0);
        }
      });
    } else {
      await performSeeding();
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

const performSeeding = async () => {
  console.log('📚 Fetching books from Google Books API...\n');

  let allBooks = [];

  // Fetch books from multiple categories
  for (const category of bookCategories) {
    console.log(`🔍 Fetching ${category} books...`);
    const books = await fetchBooksFromCategory(category, 5);
    allBooks = allBooks.concat(books);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Remove duplicates by title
  const uniqueBooks = allBooks.reduce((acc, current) => {
    const duplicate = acc.find(item => item.title === current.title);
    if (!duplicate) {
      return acc.concat([current]);
    }
    return acc;
  }, []);

  console.log(`\n✨ Found ${uniqueBooks.length} unique books.`);

  if (uniqueBooks.length === 0) {
    console.log('❌ No books found to seed.');
    process.exit(1);
  }

  // Insert books into database
  await Book.insertMany(uniqueBooks);

  console.log(`\n✅ Successfully seeded ${uniqueBooks.length} books!`);
  console.log('\n📊 Sample books:');
  uniqueBooks.slice(0, 5).forEach((book, index) => {
    console.log(`${index + 1}. ${book.title} by ${book.author}`);
  });

  console.log('\n🎉 Database seeding complete!');
  process.exit(0);
};

seedBooks();
