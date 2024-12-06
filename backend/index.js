const express = require("express");
const cors = require("cors");
const db = require("./db");
const mainRouter = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', mainRouter);

app.listen(3000, () => {
    console.log('app is running on port 3000')
});