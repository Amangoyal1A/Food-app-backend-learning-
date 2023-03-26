const express = require("express");

const authRouter = express.Router();

const {
  middleware1,
  middleware2,
  getSignup,
  Signup,
  loginUser,
} = require("../Controllers/authController");
//base router in main.js
authRouter
  .route("/signup")
  .get(middleware1, getSignup, middleware2)
  .post(Signup);

authRouter.route("/login").post(loginUser);

module.exports = {
  authRouter,
};
