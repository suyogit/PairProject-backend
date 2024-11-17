const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }

  //   try {
  //     const users = await User.find({ emailId: userEmail });
  //     if (users.length === 0) {
  //       res.status(404).send("User not found");
  //     } else {
  //       res.send(users);
  //     }
  //   } catch (err) {
  //     res.status(400).send("Something went wrong");
  //   }
});

//delete user by id
app.delete("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    await User.findByIdAndDelete(emailId);
    res.send("User deleted");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update data of the user by id
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
     await User.findByIdAndUpdate(userId, data);
    res.send("Successfully updated");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//get all users data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//add user to db
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
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
