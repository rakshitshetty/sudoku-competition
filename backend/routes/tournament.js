const express = require("express");
const tournamentController = require("../controllers/tournamentController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Create a tournament
router.post("/create", authenticate, tournamentController.createTournament);

// Sign up for a tournament
router.post("/signup", authenticate, tournamentController.signUpForTournament);

// Check tournament status
router.get("/:id/status", tournamentController.getTournamentStatus);

// Submit match result
router.post("/:id/match-result", authenticate, tournamentController.submitMatchResult);

router.get("/:id/matches", authenticate, tournamentController.getTournamentMatches);

module.exports = router;

