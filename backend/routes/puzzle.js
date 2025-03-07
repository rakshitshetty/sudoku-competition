const express = require("express");
const puzzleController = require("../controllers/puzzleController");

const router = express.Router();

// Authentication routes
router.get("/daily-puzzle", puzzleController.getDailyPuzzle);

module.exports = router;