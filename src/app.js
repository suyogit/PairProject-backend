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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length>10)
    {
        throw new Error("Cannot add more than 10 skills");
    }
    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("Successfully updated");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
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
  const { emailId } = req.body;
  try {
    // Check if user already exists with the given emailId
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email ID already in use");
    }
    await user.save();
    res.send("User added successfully");
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
// app.post("/signup", async (req, res) => {
//     const user = new User(req.body);
//     try {
//       await user.save();
//       res.send("User added succesfully");
//     } catch (err) {
//       res.status(400).send("Error saving the user: " + err.message);
//     }
//   });
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
