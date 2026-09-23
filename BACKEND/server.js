const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const foodRequestRoutes = require("./routes/foodRequestRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-request", foodRequestRoutes);

// Test routes
app.get("/api/request-test", (req, res) => {
    res.send("FOOD REQUEST ROUTE WORKS");
});

app.get("/api/food-test", (req, res) => {
    res.send("FOOD TEST ROUTE WORKS");
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

// React fallback route
app.use((req, res) => {
    res.sendFile(
        path.join(__dirname, "../FRONTEND/dist", "index.html")
    );
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});