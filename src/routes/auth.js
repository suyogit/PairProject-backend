const express = require("express");
const authRouter = express.Router();
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//add user to db
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    if (password.length > 64) {
      throw new Error(
        "Password exceeds the maximum allowed length of 64 characters."
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // Check if user already exists with the given emailId
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email ID already in use");
    }
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    // add token to cookie and send the response to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 360000),
    }); // 1 hour has 3600000 milliseconds
    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      // Collect validation errors and send a clean response
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).send(errorMessages.join(", "));
    } else {
      res.status(400).send("Error saving the user: " + err.message);
    }
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //creating jwt token
      const token = await user.getJWT();
      // add token to cookie and send the response to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 360000),
      }); // 1 hour has 3600000 milliseconds
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) }); //exxpring the token immidiatly
  res.send("Logged out");
});
module.exports = authRouter;
