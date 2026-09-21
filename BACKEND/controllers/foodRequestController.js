const FoodRequest = require("../models/FoodRequest");

// ================= REQUEST FOOD =================
const requestFood = async (req, res) => {
    try {
        const { receiver, food, quantity, message } = req.body;

        if (!receiver || !food || !quantity) {
            return res.status(400).json({
                message: "Receiver, food and quantity are required"
            });
        }

        const foodRequest = await FoodRequest.create({
            receiver,
            food,
            quantity,
            message
        });

        res.status(201).json({
            message: "Food requested successfully",
            foodRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Food request failed",
            error: error.message
        });
    }
};

// ================= GET FOOD REQUESTS =================
const getFoodRequests = async (req, res) => {
    try {
        const requests = await FoodRequest.find()
            .populate("receiver", "name email")
            .populate("food", "foodName quantity location");

        res.status(200).json({
            message: "Food requests fetched successfully",
            requests
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food requests",
            error: error.message
        });
    }
};

module.exports = {
    requestFood,
    getFoodRequests
};