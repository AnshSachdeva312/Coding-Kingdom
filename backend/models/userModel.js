const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 6,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User;