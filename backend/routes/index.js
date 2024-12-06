const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const taskRouter = require("./task");

router.use("/user", userRouter);
router.use("/task", taskRouter);

module.exports = router;