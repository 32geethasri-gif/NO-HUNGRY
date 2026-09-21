const Food = require("../models/Food");

// ================= DONATE FOOD =================
const donateFood = async (req, res) => {
    try {
        const {
            foodName,
            quantity,
            description,
            location,
            donor
        } = req.body;

        if (!foodName || !quantity || !location || !donor) {
            return res.status(400).json({
                message:
                    "Food name, quantity, location and donor are required"
            });
        }

        const food = await Food.create({
            foodName,
            quantity,
            description,
            location,
            donor
        });

        res.status(201).json({
            message: "Food donated successfully",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Food donation failed",
            error: error.message
        });
    }
};

// ================= GET AVAILABLE FOOD =================
const getAvailableFood = async (req, res) => {
    try {
        const food = await Food.find({
            status: "available"
        }).populate("donor", "name email");

        res.status(200).json({
            message: "Available food fetched successfully",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food",
            error: error.message
        });
    }
};

// ================= GET MY DONATIONS =================
const getMyDonations = async (req, res) => {
    try {
        const { donor } = req.query;

        if (!donor) {
            return res.status(400).json({
                message: "Donor ID is required"
            });
        }

        const food = await Food.find({
            donor: donor
        })
            .populate("donor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Donations fetched successfully",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donations",
            error: error.message
        });
    }
};

module.exports = {
    donateFood,
    getAvailableFood,
    getMyDonations
};