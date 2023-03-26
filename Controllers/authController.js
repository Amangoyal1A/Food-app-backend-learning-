const userModel = require("../models/userModel");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function middleware1(req, res, next) {
  console.log("middleware 1 encountred");
  next();
}

function middleware2(req, res) {
  console.log("middleware 2 encountred");
  res.sendFile(path.join(__dirname, "../Public", "index.html"));
}

function getSignup(req, res, next) {
  console.log("getsignup called");
  next();
}

async function Signup(req, res) {
  try {
    const obj = req.body;
    //  console.log("Received request with body:", obj);

    let datafrombackend = await userModel.create(obj);
    //  console.log("Created user:", datafrombackend);

    if (datafrombackend) {
      res.json({
        message: "user signed up",
        data: datafrombackend,
      });
    } else {
      res.json({
        message: "error while signup",
      });
    }
  } catch (err) {
    console.log("Error occurred:", err.message);
    res.json({
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        //JWT
        let payload = user["_id"];

        let jwttoken = jwt.sign({ payload: payload }, process.env.JWT_KEY);
        res.cookie("isLoggedIn", jwttoken, {
          httpOnly: true,
        });
        return res.status(200).json({
          message: "User login successful",
          user: user,
        });
      } else {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while logging in",
    });
  }
}

function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "operation not allowed",
      });
    }
  };
}

// This function is an asynchronous middleware function to protect a route from unauthorized access
async function protectRouteFromAuth(req, res, next) {
  try {
    let token;

    // Check if the cookie with the key 'isLoggedIn' is present in the request object
    if (req.cookies.isLoggedIn) {
      console.log(req.cookies);

      // If the cookie is present, retrieve its value as the token
      token = req.cookies.isLoggedIn;

      // Verify the token using the JWT_KEY to get the payload
      let payload = jwt.verify(token, process.env.JWT_KEY);

      // If the payload is valid, get the user from the database using the ID in the payload
      if (payload) {
        console.log("payload token", payload);
        const user = await userModel.findById(payload.payload);

        // Add the role and ID of the user to the request object for later use
        req.role = user.role;
        req.id = user.id;
        console.log(req.role, req.id);

        // Call the next middleware function in the chain
        next();
      } else {
        // If the payload is invalid, return a JSON response with a message asking the user to login again
        return res.json({
          message: "please login again",
        });
      }
    } else {
      // If the cookie is not present, check if the request is coming from a browser or Postman

      // If the request is coming from a browser, redirect the user to the login page
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
        return res.redirect("/login");
      }

      // If the request is coming from Postman, return a JSON response with a message asking the user to login
      res.json({
        message: "please login",
      });
    }
  } catch (err) {
    // If an error occurs during the execution of the function, return a JSON response with the error message
    return res.json({
      message: err.message,
    });
  }
}

async function forgetPassword(req, res) {
  let { email } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const resetToken = user.createResetToken();
      // http://example.com/resetPassword/resetToken
      const resetPasswordlink = `${req.protocol}://${req.host}/resetPassword/resetToken`;
      //nodemailer
    } else {
      return res.json({
        message: "Please signup",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const token = req.params.token;

    let { password, confirmpassword } = req.body;

    const user = await userModel.findOne({
      resetToken: token,
    });

    user.resetPasswordHandler(password, confirmpassword);
    await user.save();
    res.json({
      message: "password changed successfully 🥳",
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

function logout(req, res) {
  res.clearCookie("isLoggedIn");
  res.json({ message: "Logged out successfully" });
}

module.exports = {
  middleware1,
  middleware2,
  getSignup,
  Signup,
  loginUser,
  isAuthorised,
  protectRouteFromAuth,
  forgetPassword,
  resetPassword,
  logout,
};
