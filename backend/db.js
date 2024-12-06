const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("db connected");
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        min: 3,
        max: 20,
        required: true
    },
    email: {
        type: String,
        unique: true,
        min: 3,
        max: 20,
        required: true
    },
    password: {
        type: String,
        min: 6,
        max: 20,
        required: true,
    }
});

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    description: {
        type: String,
        min: 3,
        max: 500,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Ongoing", "Completed"],
        default: "Pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = db;
module.exports = {User, Task};