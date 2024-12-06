const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { User } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
require("dotenv").config();

const userSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().trim().min(3).max(20).email(),
  password: z.string().trim().min(6).max(20),
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const userValidation = userSchema.safeParse({ username, email, password });

  if (!userValidation.success) {
    return res.status(401).json({ msg: "Wrong input" });
  }

  const user = await User.findOne({ username });

  if (user) {
    return res.status(401).json({ msg: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      email,
      password: hash,
    });
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    return res
      .status(201)
      .json({
        msg: "User created successfully",
        newUser,
        token: `Bearer ${token}`,
      });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ msg: "Could not create the user" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  const isMatched = await bcrypt.compare(password, user?.password);

  if (!isMatched) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  try {
    const token = jwt.sign(
      { username: user?.username },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ token: `Bearer ${token}`, user });
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ msg: "Cannot sign in" });
  }
});


module.exports = router;
