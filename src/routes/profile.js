const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validator = require("validator");

const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("This is your data" + user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password, currentPassword } = req.body;
    if (!password || !currentPassword) {
      throw new Error("Missing or empty fields");
    }
    if (password.length > 64 || currentPassword.length > 64) {
      throw new Error(
        "Password or current password exceeds the maximum allowed length of 64 characters."
      );
    }

    if (!validateEditPassword(req)) {
      throw new Error("Invalid Edit Request");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password is not strong enough. It must include uppercase, lowercase, numbers, and special characters."
      );
    }
    const loggedInUser = req.user;
    const isMatch = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );
    if (!isMatch) {
      throw new Error("Password is incorrect.");
    }

    loggedInUser.password = await bcrypt.hash(password, 10);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your password updated successfuly`,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
