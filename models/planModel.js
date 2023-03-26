const emailValidator = require("email-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require('./db');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20,"plan name should not exceed more than 20 char"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ratingsAverage:{
    type:Number
  },
  discount:{
    type:Number,
    function (){
        return this.discount<100;
    }
  }
});


const planModel = mongoose.model("planModel", planSchema);





module.exports= planModel
