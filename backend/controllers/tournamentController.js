const pool = require("../database/db");
const { getSudoku } = require("sudoku-gen");
const {generateTournamentPuzzle} = require("../controllers/puzzleController");

// Create a tournament
exports.createTournament = async (req, res) => {
    const { name, maxPlayers } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            "INSERT INTO tournaments (name, created_by, max_players) VALUES ($1, $2, $3) RETURNING *",
            [name, userId, maxPlayers]
        );
        res.status(201).json({ message: "Tournament created", tournament: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error creating tournament" });
    }
};

// Sign up for a tournament
exports.signUpForTournament = async (req, res) => {
    const { tournamentId } = req.body;
    const userId = req.user.userId;

    try {
        // Add player to tournament
        await pool.query(
            "INSERT INTO tournament_players (tournament_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [tournamentId, userId]
        );

        // Check if tournament is full
        const playerCount = await pool.query(
            "SELECT COUNT(*) FROM tournament_players WHERE tournament_id = $1",
            [tournamentId]
        );
        const maxPlayers = await pool.query(
            "SELECT max_players FROM tournaments WHERE id = $1",
            [tournamentId]
        );

        if (parseInt(playerCount.rows[0].count) === maxPlayers.rows[0].max_players) {
            // Start tournament
            await startTournament(tournamentId);
        }

        res.status(200).json({ message: "Signed up for tournament" });
    } catch (error) {
        res.status(500).json({ error: "Error signing up" });
    }
};

// Function to start tournament once it's full
const startTournament = async (tournamentId) => {
    try {
        await pool.query("UPDATE tournaments SET status = 'in-progress' WHERE id = $1", [tournamentId]);

        // Get all players
        const players = await pool.query(
            "SELECT user_id FROM tournament_players WHERE tournament_id = $1",
            [tournamentId]
        );

        // Shuffle players randomly
        const shuffledPlayers = players.rows.map(p => p.user_id).sort(() => Math.random() - 0.5);

        // Assign matches with unique puzzles
        for (let i = 0; i < shuffledPlayers.length; i += 2) {
            if (i + 1 < shuffledPlayers.length) {
                // Create match
                const matchResult = await pool.query(
                    "INSERT INTO tournament_matches (tournament_id, round, player1_id, player2_id) VALUES ($1, 1, $2, $3) RETURNING id",
                    [tournamentId, shuffledPlayers[i], shuffledPlayers[i + 1]]
                );

                const matchId = matchResult.rows[0].id;

                // Generate and assign puzzle to match
                await puzzleController.generateTournamentPuzzle(matchId);
            }
        }

        console.log(`🎯 Tournament ${tournamentId} started!`);
    } catch (error) {
        console.error("❌ Error starting tournament", error);
    }
};

// Generate unique Sudoku puzzle (Stub for now)
const generateUniquePuzzle = async (req, res) => {
    const { matchId } = req.body;
    return generateTournamentPuzzle(matchId); // Placeholder puzzle ID
};

// Submit match result
exports.submitMatchResult = async (req, res) => {
    const { matchId, winnerId } = req.body;

    try {
        await pool.query(
            "UPDATE tournament_matches SET winner_id = $1 WHERE id = $2",
            [winnerId, matchId]
        );

        // Check if this was the final match
        const remainingPlayers = await pool.query(
            "SELECT COUNT(*) FROM tournament_matches WHERE tournament_id = (SELECT tournament_id FROM tournament_matches WHERE id = $1) AND winner_id IS NULL",
            [matchId]
        );

        if (parseInt(remainingPlayers.rows[0].count) === 0) {
            // Declare winner
            await pool.query(
                "UPDATE tournaments SET status = 'completed', winner_id = $1 WHERE id = (SELECT tournament_id FROM tournament_matches WHERE id = $2)",
                [winnerId, matchId]
            );
            return res.status(200).json({ message: "Tournament completed", winner: winnerId });
        }

        res.status(200).json({ message: "Match result submitted" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting match result" });
    }
};

exports.getTournamentStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM tournaments WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tournament not found." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tournament status" });
    }
};

exports.getTournamentMatches = async (req, res) => {
    try {
        const tournamentId = req.params.id;

        // Fetch matches for the given tournament ID
        const result = await pool.query(
            "SELECT * FROM tournament_matches WHERE tournament_id = $1 ORDER BY round ASC",
            [tournamentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No matches found for this tournament." });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tournament matches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
