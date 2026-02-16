const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      default: 'issued',
    },
    fineAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    penaltyAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    penaltyPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

issueSchema.index({ userId: 1, bookId: 1 });

module.exports = mongoose.model('Issue', issueSchema);
