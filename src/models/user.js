const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [1, "First Name must be at least 1 character long"],
      maxLength: [30, "First Name cannot exceed 30 characters"],
      match: [
        /^[A-Za-z\s]+$/,
        "First Name must contain only letters and spaces",
      ], // Only letters and spaces
    },
    lastName: {
      type: String,
      minLength: [1, "Last Name must be at least 1 character long"],
      match: [
        /^[A-Za-z\s]+$/,
        "Last Name must contain only letters and spaces",
      ], // Only letters and spaces
    },
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID format");
        }
        // const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        // if (!emailRegex.test(value)) {
        //   throw new Error("Invalid Email ID format");
        // }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
        // Password must be at least 8 characters long with one special character
        const passwordRegex = /^(?=.*?[#?!@$%^&*-]).{8,}$/;

        if (!passwordRegex.test(value)) {
          throw new Error(
            "Password must be minimum eight characters with one special character"
          );
        }
      },
    },
    age: {
      type: Number,
      // required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
      max: [120, "Age cannot exceed 120"], // Maximum age is 120
    },
    gender: {
      type: String,
      // required: [true, "Gender is required"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error(
            "Gender must be one of the following: male, female, others"
          );
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (value && !/^https?:\/\/[^\s]+$/.test(value)) {
          // Check if URL is valid
          throw new Error("Invalid URL format for photo");
        }
      },
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
      type: String,
      maxLength: [200, "About field cannot exceed 200 characters"], // Limit the length of 'about'
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          // Limit number of skills to 10
          throw new Error("You can only have a maximum of 10 skills");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUsesr) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordByUsesr, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
