const Donation = require("../models/Donation");

// Create a donation
const createDonation = async (req, res) => {
    try {
        const donation = await Donation.create(req.body);

        res.status(201).json({
            message: "Food donation submitted successfully",
            donation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create donation",
            error: error.message
        });
    }
};

// Get all donations
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });

        res.json(donations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donations",
            error: error.message
        });
    }
};

module.exports = {
    createDonation,
    getDonations
};