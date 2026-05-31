const mongoose = require("mongoose");

const reviewSchema =
new mongoose.Schema({

studentName:String,

messName:String,

rating:Number,

comment:String

});

module.exports =
mongoose.model("Review",
reviewSchema);