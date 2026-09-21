const express = require("express");

const {
    requestFood,
    getFoodRequests
} = require("../controllers/foodRequestController");

const router = express.Router();

// Request food
router.post("/request", requestFood);

// Get all food requests
router.get("/all", getFoodRequests);

module.exports = router;