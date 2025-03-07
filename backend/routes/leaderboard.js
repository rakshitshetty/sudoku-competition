const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Get leaderboard
router.get("/", leaderboardController.getLeaderboard);

// Submit score (requires authentication)
router.post("/submit-score", authenticate, leaderboardController.submitScore);

module.exports = router;
