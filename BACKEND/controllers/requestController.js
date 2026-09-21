const FoodRequest = require("../models/FoodRequest");

// Create a food request
const createRequest = async (req, res) => {
    try {
        const request = await FoodRequest.create(req.body);

        res.status(201).json({
            message: "Food request submitted successfully",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create food request",
            error: error.message
        });
    }
};

// Get all food requests
const getRequests = async (req, res) => {
    try {
        const requests = await FoodRequest.find().sort({ createdAt: -1 });

        res.json(requests);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food requests",
            error: error.message
        });
    }
};

module.exports = {
    createRequest,
    getRequests
};