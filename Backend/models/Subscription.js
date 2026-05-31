const mongoose = require("mongoose");

const subscriptionSchema =
new mongoose.Schema({

studentEmail:{
type:String,
required:true
},

messName:{
type:String,
required:true
},

plan:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

date:{
type:Date,
default:Date.now
}

});

module.exports =
mongoose.model(
"Subscription",
subscriptionSchema
);