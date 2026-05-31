const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({

    name: String,

    foodType: String,

    price: Number,

    location: String,

    description: String,

    image: String

});

module.exports = mongoose.model("Mess", messSchema);