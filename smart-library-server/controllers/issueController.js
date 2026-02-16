const mongoose = require('mongoose');
const Book = require('../models/Book');
const Issue = require('../models/Issue');

const issueBook = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookId } = req.body;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Valid bookId is required' });
    }

    await session.withTransaction(async () => {
      const book = await Book.findOne({ _id: bookId, isActive: true }).session(session);

      if (!book) {
        throw new Error('BOOK_NOT_FOUND');
      }

      if (book.availableCopies <= 0) {
        throw new Error('NO_COPIES');
      }

      const duplicateIssue = await Issue.findOne({
        userId: req.user._id,
        bookId,
        status: { $in: ['issued', 'overdue'] },
      }).session(session);

      if (duplicateIssue) {
        throw new Error('ALREADY_ISSUED');
      }

      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 7);

      await Issue.create(
        [
          {
            userId: req.user._id,
            bookId,
            issueDate,
            dueDate,
            status: 'issued',
          },
        ],
        { session }
      );

      book.availableCopies -= 1;
      await book.save({ session });
    });

    const latestIssue = await Issue.findOne({ userId: req.user._id, bookId }).sort({ createdAt: -1 });
    return res.status(201).json(latestIssue);
  } catch (error) {
    if (error.message === 'BOOK_NOT_FOUND') {
      return res.status(404).json({ message: 'Book not found or inactive' });
    }

    if (error.message === 'NO_COPIES') {
      return res.status(400).json({ message: 'No available copies left' });
    }

    if (error.message === 'ALREADY_ISSUED') {
      return res.status(400).json({ message: 'Book is already issued to this user' });
    }

    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

const returnBook = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid issue id' });
    }

    let updatedIssue;

    await session.withTransaction(async () => {
      const issue = await Issue.findById(id).session(session);

      if (!issue) {
        throw new Error('ISSUE_NOT_FOUND');
      }

      if (String(issue.userId) !== String(req.user._id) && req.user.role !== 'admin') {
        throw new Error('FORBIDDEN');
      }

      if (issue.status === 'returned' || issue.returnDate) {
        throw new Error('ALREADY_RETURNED');
      }

      const book = await Book.findById(issue.bookId).session(session);

      if (!book) {
        throw new Error('BOOK_NOT_FOUND');
      }

      issue.returnDate = new Date();
      issue.status = 'returned';
      updatedIssue = await issue.save({ session });

      book.availableCopies += 1;
      if (book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }
      await book.save({ session });
    });

    return res.status(200).json(updatedIssue);
  } catch (error) {
    if (error.message === 'ISSUE_NOT_FOUND') {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (error.message === 'ALREADY_RETURNED') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    if (error.message === 'BOOK_NOT_FOUND') {
      return res.status(404).json({ message: 'Related book not found' });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Not allowed to return this issue' });
    }

    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

const getMyIssues = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    let query;
    if (isAdmin) {
      // Admin sees all issues
      query = Issue.find();
    } else {
      // Student sees only their issues
      query = Issue.find({ userId: req.user._id });
    }

    const issues = await query
      .populate('bookId', 'title author category coverImage')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ issues });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { issueBook, returnBook, getMyIssues };
