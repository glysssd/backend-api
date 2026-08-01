const express = require("express");
const cors = require("cors");

const userRoutes = require("../routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Backend API is running!" });
});

module.exports = app;