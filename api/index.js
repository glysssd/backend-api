const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("../routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running!"
  });
});

app.use("/api/users", userRoutes);

module.exports = app;