const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const {userRouter} = require("./Routers/userRouter");
const {authRouter} = require("./Routers/authRouter");
const {planRouter} = require("./Routers/planRouter");
const { reviewRouter } = require("./Routers/reviewRouter");
app.use(express.json());
app.use(cookieParser());

//base route
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/plans",planRouter);
app.use("/review",reviewRouter)
//final route for example localhost:3001/users

app.listen(3001, (req, res) => {
  console.log("app listen");
});
