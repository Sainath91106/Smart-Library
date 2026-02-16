const mongoose = require('mongoose');
const Book = require('../models/Book');

const createBook = async (req, res) => {
  try {
    const { title, author, category, description, aiSummary, totalCopies, availableCopies, coverImage } = req.body;

    if (!title || !author || !category || totalCopies === undefined || availableCopies === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (availableCopies > totalCopies) {
      return res.status(400).json({ message: 'availableCopies cannot exceed totalCopies' });
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      aiSummary,
      totalCopies,
      availableCopies,
      coverImage,
    });

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const { search, category, available } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const book = await Book.findOne({ _id: id, isActive: true });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const existingBook = await Book.findById(id);

    if (!existingBook || !existingBook.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updates = { ...req.body };

    const totalCopies =
      updates.totalCopies !== undefined ? Number(updates.totalCopies) : Number(existingBook.totalCopies);
    const availableCopies =
      updates.availableCopies !== undefined ? Number(updates.availableCopies) : Number(existingBook.availableCopies);

    if (availableCopies > totalCopies) {
      return res.status(400).json({ message: 'availableCopies cannot exceed totalCopies' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const book = await Book.findOneAndUpdate({ _id: id, isActive: true }, { isActive: false }, { new: true });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };
