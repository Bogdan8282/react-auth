const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(mongoSanitize());

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
  const { name, password } = req.body;

  if (!name || name.length < 3 || /\s/.test(name)) {
    return res
      .status(400)
      .send("Name must be at least 3 characters and contain no spaces");
  }

  try {
    const existingUser = await User.findOne({ name: name });

    if (existingUser) {
      return res.status(400).send("User with this name already exists");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).send(passwordError);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, { httpOnly: true, secure: false }) // secure: true for production
      .status(201)
      .json({ message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ message: "Login successful" });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/check-auth", (req, res) => {
  const token = req.cookies.token;

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

app.delete("/api/delete-account", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token").status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
});

function validatePassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  return null;
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(apiLimiter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
