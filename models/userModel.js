const emailValidator = require("email-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require('./db');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  confirmpassword: {
    type: String,
    required: true,
    min: 8,
    validate: function () {
      return this.password === this.confirmpassword;
    },
  },

  role: {
    type: String,
    enum: ["Admin", "user", "restaurantowner", "delivery"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpeg",
  },
  resetToken: String,
});

//hooks in mongo
userSchema.pre("save", function () {
  this.confirmpassword = undefined;
});

userSchema.pre("save", async function () {
  let salt = await bcrypt.genSalt();
  let bcrypthash = await bcrypt.hash(this.password, salt);
  this.password = bcrypthash;
});


userSchema.methods.createResetToken=function(){
  //creating unique token using npm i crypto
  const resetToken=crypto.randomBytes(32).toString("hex");
  this.resetToken=resetToken;
  return resetToken;
}
// userSchema.methods.createResetToken = function () {
// crypto.randomBytes(32, function(ex, buf) {
//   var token = buf.toString('hex');
//   this.resetToken = token;
// });
// }
userSchema.methods.resetPasswordHandler = function (password,confirmpassword) {
this.password = password;
this.confirmpassword = confirmpassword;

this.resetToken = undefined


};
const userModel = mongoose.model("userModel", userSchema);


module.exports = userModel;
