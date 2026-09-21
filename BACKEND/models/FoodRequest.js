const mongoose = require("mongoose");

const foodRequestSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        message: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FoodRequest", foodRequestSchema);