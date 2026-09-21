const express = require("express");

const {
    donateFood,
    getAvailableFood,
    getMyDonations
} = require("../controllers/foodController");

const router = express.Router();

console.log("FOOD ROUTES LOADED");

// Donate food
router.post("/donate", donateFood);

// Get available food
router.get("/available", getAvailableFood);

// Get donor's own donations
router.get("/my-donations", getMyDonations);

module.exports = router;