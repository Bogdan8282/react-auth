const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/check-auth", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ authenticated: false });
      }
      User.findById(decoded.userId)
        .then((user) => {
          if (user) {
            res.json({ authenticated: true, user });
          } else {
            res
              .status(404)
              .json({ authenticated: false, message: "User not found" });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Server error" });
        });
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
