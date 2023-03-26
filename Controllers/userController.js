const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const users = [
//   { name: "Aarav", id: 1, age: 22 },
//   { name: "Diya", id: 2, age: 27 },
//   { name: "Kavya", id: 3, age: 19 },
//   { name: "Rahul", id: 4, age: 31 },
//   { name: "Shreya", id: 5, age: 25 },
// ];

async function getUser(req, res) {
  let id = req.id;

  let users = await userModel.findById(id);

  if (users) {
    res.json(users);
  } else {
    res.json({
      message: "user not found",
    });
  }
}

async function updateUser(req, res) {
  console.log("req.body-> ", req.body);
  //update data in users obj
  try {
    let id = req.params.id;
    console.log(id);
    let user = await userModel.findById(id);
    console.log(user);
    let dataToBeUpdated = req.body;
    if (user) {
      console.log("inside user");
      const keys = [];
      for (let key in dataToBeUpdated) {
        console.log(key);
        keys.push(key);
      }

      for (let i = 0; i < keys.length; i++) {
        console.log(keys[i]);
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }
      console.log(user);
      user.confirmPassword = user.password;
      const updatedData = await user.save();
      console.log(updatedData);
      res.json({
        message: "data updated successfully",
        data: updatedData,
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let deleteuser = await userModel.findByIdAndDelete(id);

    if (!deleteuser) {
      res.json({
        message: "user not found",
      });
    } else {
      res.json({
        message: "user deleted successfully",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}

async function getAllusers(req, res) {
  let users = await userModel.find();
  if (users) {
    res.json({
      message: "users retrieved",
      users: users,
    });
  }
}

function getCookies(req, res) {}

function setCookies(req, res) {
  res.cookie("isLoggedIn", true, {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  });
  res.send("cookie set ");
}

function protectRoute(req, res, next) {
  const token = req.cookies.isLoggedIn;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Store the decoded user object in the request object for future use
    next();
  } catch (ex) {
    return res.status(400).json({ message: "Invalid token." });
  }
}

module.exports = {
  getUser,
  // postUser,
  updateUser,
  getAllusers,
  deleteUser,
  setCookies,
  getCookies,
  protectRoute,
};
