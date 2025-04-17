const express = require("express");
const { login, signup, allUsers } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const authRoutes = express.Router();

// Signup Route
authRoutes.post("/signup", signup);

// Login Route
authRoutes.post("/login", login);

// Protected Route to Get All Users
authRoutes.get("/all", authMiddleware, allUsers);

module.exports = authRoutes;


