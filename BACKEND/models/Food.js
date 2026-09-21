const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        foodName: {
            type: String,
            required: true
        },

        quantity: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        location: {
            type: String,
            required: true
        },

        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["available", "requested", "collected"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Food", foodSchema);