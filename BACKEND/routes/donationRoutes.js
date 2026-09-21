const express = require("express");

const router = express.Router();

const {
    createDonation,
    getDonations
} = require("../controllers/donationController");

// Create a donation
router.post("/", createDonation);

// Get all donations
router.get("/", getDonations);

module.exports = router;