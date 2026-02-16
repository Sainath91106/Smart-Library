const express = require('express');
const { issueBook, returnBook, getMyIssues } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyIssues);
router.post('/', protect, issueBook);
router.patch('/:id/return', protect, returnBook);

module.exports = router;
