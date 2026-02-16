const express = require('express');
const { generateSummary } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/ai/summary - Generate AI summary for a book
router.post('/summary', protect, generateSummary);

module.exports = router;
