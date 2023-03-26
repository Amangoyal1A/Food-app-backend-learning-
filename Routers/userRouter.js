const express = require("express");
const app = express();
const userModel = require("../models/userModel");
const {
  getUser,
  updateUser,
  getAllusers,
  deleteUser,
} = require("../Controllers/userController");
const {
  Signup,
  loginUser,
  isAuthorised,
  protectRouteFromAuth
  ,forgetPassword,resetPassword , logout
} = require("../Controllers/authController")


const userRouter = express.Router();


userRouter.route("/:id")
.patch(updateUser)
.delete(deleteUser);

userRouter.route("/signup")
.post(Signup)

userRouter.route("/login")
.post(loginUser)

userRouter.route("/forgetPassword")
.post(forgetPassword)


userRouter.route("/resetPassword/:token")
.post(resetPassword)

userRouter.use(protectRouteFromAuth);
userRouter.route("/userProfile")
.get(getUser);

//for Admin specific
userRouter.use(isAuthorised(["Admin"]));
userRouter.route("")
.get(getAllusers);

userRouter.route("/logout")
.get(logout)
 

module.exports = {
  userRouter
};
