const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { Task } = require("../db");
const { authMiddleware } = require("../middleware");

const taskSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(3).max(500),
  type: z.string(),
});

router.post("/addTask", authMiddleware, async (req, res) => {
  const { title, description, type } = req.body;
  const userId = req.userId;

  const taskValidation = taskSchema.safeParse({
    title,
    description,
    type,
  });

  if (!taskValidation.success) {
    return res.status(400).json({ msg: "Wrong input." });
  }

  try {
    const task = await Task.create({
      title,
      description,
      type,
      userId,
    });
    return res.status(201).json({ msg: "Task created successfully", task });
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ msg: "Could not create the task." });
  }
});

router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req?.userId });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ msg: "Could not fetch the tasks." });
  }
});

module.exports = router;
