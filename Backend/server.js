const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ======================================
// MIDDLEWARE
// ======================================
app.use(cors());

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

// ======================================
// FRONTEND SERVE (IMPORTANT FIX)
// ======================================
app.use(express.static(path.join(__dirname, "HTML")));

// ======================================
// CLOUDINARY SETUP
// ======================================
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "messmate",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage });

// ======================================
// MONGODB CONNECTION
// ======================================
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
});

// ======================================
// SCHEMAS
// ======================================

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const messSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: "Veg" },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: String,
    image: String,
    rating: { type: Number, default: 4 },
    createdAt: { type: Date, default: Date.now }
});

const Mess = mongoose.model("Mess", messSchema);

const reviewSchema = new mongoose.Schema({
    messId: String,
    userEmail: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

// ======================================
// ROOT ROUTE (FRONTEND LOAD)
// ======================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", "index.html"));
});

// ======================================
// TEST ROUTE
// ======================================
app.get("/api", (req, res) => {
    res.send("MessMate Backend Running 🚀");
});

// ======================================
// SIGNUP ROUTE
// ======================================
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.json({
            success: true,
            message: "Signup successful 🚀"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// LOGIN ROUTE
// ======================================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "admin@messmate.com" && password === "admin123") {
            return res.json({
                success: true,
                isAdmin: true
            });
        }

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.json({
            success: true,
            isAdmin: false,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// IMAGE UPLOAD
// ======================================
app.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }

        res.json({
            success: true,
            imageUrl: req.file.path
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ======================================
// ADD MESS
// ======================================
app.post("/messes", async (req, res) => {
    try {
        const { name, type, price, location, description, image } = req.body;

        if (!name || !price || !location) {
            return res.status(400).json({
                message: "Name, price and location required"
            });
        }

        const mess = new Mess({
            name,
            type,
            price,
            location,
            description,
            image
        });

        await mess.save();

        res.json({
            success: true,
            message: "Mess added successfully 🚀",
            data: mess
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// GET ALL MESSES
// ======================================
app.get("/messes", async (req, res) => {
    try {
        const messes = await Mess.find().sort({ createdAt: -1 });
        res.json(messes);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// GET SINGLE MESS
// ======================================
app.get("/messes/:id", async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.id);

        if (!mess) {
            return res.status(404).json({
                message: "Mess not found"
            });
        }

        res.json(mess);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// DELETE MESS
// ======================================
app.delete("/messes/:id", async (req, res) => {
    try {
        await Mess.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Mess deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// ADD REVIEW
// ======================================
app.post("/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();

        const reviews = await Review.find({
            messId: req.body.messId
        });

        let total = 0;
        reviews.forEach(item => total += item.rating);

        const avgRating = total / reviews.length;

        await Mess.findByIdAndUpdate(req.body.messId, {
            rating: avgRating.toFixed(1)
        });

        res.json({
            success: true,
            message: "Review added 🚀"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// GET REVIEWS
// ======================================
app.get("/reviews/:messId", async (req, res) => {
    try {
        const reviews = await Review.find({
            messId: req.params.messId
        }).sort({ createdAt: -1 });

        res.json(reviews);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ======================================
// START SERVER
// ======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});