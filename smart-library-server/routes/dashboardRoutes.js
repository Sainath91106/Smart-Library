const express = require('express');
const {
  getDashboardStats,
  getOverdueBooks,
  getRecentIssues,
  getStudentRecentIssues,
  getDueSoonAlerts,
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/overdue', protect, adminOnly, getOverdueBooks);
router.get('/recent-issues', protect, adminOnly, getRecentIssues);
router.get('/my-recent-issues', protect, getStudentRecentIssues);
router.get('/due-alerts', protect, getDueSoonAlerts);

module.exports = router;
