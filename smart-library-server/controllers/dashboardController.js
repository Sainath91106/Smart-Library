const Book = require('../models/Book');
const Issue = require('../models/Issue');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    if (isAdmin) {
      // Admin stats
      const [totalBooks, issuedBooks, totalUsers] = await Promise.all([
        Book.countDocuments({ isActive: true }),
        Issue.countDocuments({ status: 'issued' }),
        User.countDocuments({ isActive: true }),
      ]);

      const availableBooks = totalBooks - issuedBooks;

      return res.status(200).json({
        totalBooks,
        issuedBooks,
        totalUsers,
        availableBooks,
      });
    } else {
      // Student stats
      const issuedBooks = await Issue.countDocuments({
        userId: req.user._id,
        status: { $in: ['issued', 'overdue'] },
      });

      return res.status(200).json({
        issuedBooks,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const today = new Date();
    const overdueIssues = await Issue.find({
      status: { $in: ['issued', 'overdue'] },
      dueDate: { $lt: today },
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 })
      .limit(50);

    const overdueWithDays = overdueIssues.map((issue) => {
      const daysOverdue = Math.floor((today - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
      const penaltyAmount = daysOverdue * 5; // ₹5 per day
      return {
        ...issue.toObject(),
        daysOverdue,
        penaltyAmount,
      };
    });

    return res.status(200).json(overdueWithDays);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecentIssues = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const recentIssues = await Issue.find()
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json(recentIssues);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentRecentIssues = async (req, res) => {
  try {
    const recentIssues = await Issue.find({ userId: req.user._id })
      .populate('bookId', 'title author category coverImage')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json(recentIssues);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDueSoonAlerts = async (req, res) => {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const dueSoon = await Issue.find({
      userId: req.user._id,
      status: { $in: ['issued', 'overdue'] },
      dueDate: { $gte: today, $lte: threeDaysLater },
    })
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 });

    const overdue = await Issue.find({
      userId: req.user._id,
      status: { $in: ['issued', 'overdue'] },
      dueDate: { $lt: today },
    })
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 });

    return res.status(200).json({
      dueSoon,
      overdue,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getOverdueBooks,
  getRecentIssues,
  getStudentRecentIssues,
  getDueSoonAlerts,
};
