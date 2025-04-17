const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { uploadBountyFile, createBounty, getAllBounties, getBounty, getMyBounties } = require('../controllers/bountiesController');
const bountiesRoutes = express.Router();

// Protect all routes after this middleware

// Create a new bounty
bountiesRoutes.post(
  '/',
  authMiddleware,
  uploadBountyFile,
  createBounty
);

// Get all bounties
bountiesRoutes.get('/',authMiddleware,getAllBounties );

// Get a specific bounty
bountiesRoutes.get('/:id',authMiddleware,getBounty );
bountiesRoutes.get("/my/bounties",authMiddleware,getMyBounties);

module.exports = bountiesRoutes;