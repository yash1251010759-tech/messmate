const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User Already Exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.send("Signup Successful");

    } catch (error) {

        console.log(error);

        res.send("Error");

    }

});

// Login
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User Not Found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid Password");
        }

        // JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login Successful",
            token,
            name: user.name,
            email: user.email
        });

    } catch (error) {

        console.log(error);

        res.send("Error");

    }

});

module.exports = router;