const mongoose = require("mongoose");
const db = require("./db");
const userModel = require("./userModel");
const planModel = require("./planModel");

const reviewSchema = new mongoose.Schema({
  review: {
    required: [true, "review is required"],
    type: String,
  },
  rating: {
    required: true,
    min: 1,
    max: 10,
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: [true, "review must belong to user"],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "planModel",
    required: [true, "review must belong to plan"],
  },
});

// This function uses regular expression (/^find/) to match all query methods that begin with the
// word "find" (e.g. find(), findOne(), findById(), etc.)
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage",
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;
