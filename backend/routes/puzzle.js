const express = require("express");
const puzzleController = require("../controllers/puzzleController");

const router = express.Router();

// Authentication routes
router.get("/daily-puzzle", puzzleController.getDailyPuzzle);

// Get tournament puzzle for a specific match
router.get("/tournament-puzzle/:matchId", puzzleController.getTournamentPuzzle);

router.get("/difficulty/:difficulty", puzzleController.getPuzzleByDifficulty);

router.get("/generate/:difficulty", puzzleController.generateSudokuPuzzle);


module.exports = router;