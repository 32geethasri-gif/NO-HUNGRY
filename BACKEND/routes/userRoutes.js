const express = require("express");

const {
    getAllUsers
} = require("../controllers/userController");

const router = express.Router();

// Get all users
router.get("/all", getAllUsers);

module.exports = router;