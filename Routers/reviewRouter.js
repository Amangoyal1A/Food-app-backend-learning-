const express = require("express");
const {
  isAuthorised,
  protectRouteFromAuth,
} = require("../Controllers/authController");
const {
  getAllreviews,
  top3reviews,
  getPlanReviews,
  CreateReviews,
  deleteReview,
  updatereview,
} = require("../Controllers/reviewController");

const reviewRouter = express.Router();

reviewRouter
.route("/all")
.get(getAllreviews);

reviewRouter
.route("/top3")
.get(top3reviews);

reviewRouter
.route("/plan/:id")
.get(getPlanReviews);

reviewRouter.use(protectRouteFromAuth);
reviewRouter
.route("/crud/:plan")
.post(CreateReviews)
.delete(deleteReview)
.patch(updatereview);

module.exports = {
  reviewRouter,
};
