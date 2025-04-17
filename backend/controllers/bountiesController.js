const Bounty = require('../models/bountiesModel');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/bounties');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `bounty-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });
const uploadBountyFile = upload.single('file');

// Create a new bounty
const createBounty = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Please upload a file' });
    }
    const { name, vulnerabilities, dueDate, bountyAmount } = req.body;
    console.log(req.body);
    const bounty = await Bounty.create({
      name,
      file: req.file.path,
      vulnerabilities,
      dueDate,
      bountyAmount,
      creator: req.user.id  // Add user ID here
    });

    res.status(201).json({
      status: 'success',
      data: { bounty }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get all bounties
const getAllBounties = async (req, res) => {
  try {
    const bounties = await Bounty.find().sort('-createdAt');
    const now = new Date();

    for (const bounty of bounties) {
      const timeDiff = new Date(bounty.dueDate) - now;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1 && bounty.status !== 'expired') {
        bounty.status = 'ending soon';
        await bounty.save();
      }
    }

    res.status(200).json({
      status: 'success',
      results: bounties.length,
      data: { bounties }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get a single bounty
const getBounty = async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);

    if (!bounty) {
      return res.status(404).json({ status: 'fail', message: 'No bounty found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: { bounty }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Get bounties created by logged-in user
const getMyBounties = async (req, res) => {
  try {
    const myBounties = await Bounty.find({ creator: req.user.id }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: myBounties.length,
      data: { bounties: myBounties }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  uploadBountyFile,
  createBounty,
  getAllBounties,
  getBounty,
  getMyBounties
};
