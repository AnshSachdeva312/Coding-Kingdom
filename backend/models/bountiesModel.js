const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bounty name is required'],
    trim: true
  },
  file: {
    type: String, // Stores the file path
    required: [true, 'File is required']
  },
  vulnerabilities: {
    type: String,
    required: [true, 'Vulnerabilities description is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  bountyAmount: {
    type: Number,
    required: [true, 'Bounty amount is required'],
    min: [0.1, 'Bounty amount must be at least 0.1']
  },
  status: {
    type: String,
    enum: ['active', 'ending soon', 'expired'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on due date before saving
bountySchema.pre('save', function(next) {
  const now = new Date();
  const timeDiff = this.dueDate - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    this.status = 'ending soon';
  } else if (timeDiff < 0) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
  next();
});

// Update status when querying if needed
bountySchema.pre(/^find/, function(next) {
  this.find({ status: { $ne: 'expired' } });
  next();
});

const Bounty = mongoose.model('Bounty', bountySchema);

module.exports = Bounty;