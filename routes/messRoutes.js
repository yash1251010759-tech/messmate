const express = require("express");
const router = express.Router();

const multer = require("multer");

const Mess = require("../models/Mess");

// Multer Storage
const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage: storage });

// Add Mess
router.post("/addmess", upload.single("image"), async (req, res) => {

    try {

        const newMess = new Mess({

            name: req.body.name,

            foodType: req.body.foodType,

            price: req.body.price,

            location: req.body.location,

            description: req.body.description,

            image: req.file ? req.file.filename : ""

        });

        await newMess.save();

        res.send("Mess Added Successfully");

    } catch (error) {

        console.log(error);

        res.send("Error Adding Mess");

    }

});

module.exports = router;