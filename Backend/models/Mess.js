const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({

name:String,

foodType:String,

price:Number,

rating:Number,

location:String,

image:String

});

module.exports =
mongoose.model("Mess", messSchema);