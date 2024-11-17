const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.post("/signup", async(req,res) => {
  const user = new User({
    firstName: "Suyog",
    lastName: "Acharya",
    emailId: "asuyog042@gmail.com",
    password: "hahaha",
  });
  try{
    await user.save();
    res.send("User added succesfully");
  }
  catch(err)
  {
    res.status(400).send("Error saving the user: " + err.message)
  }

});

connectDB()
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
