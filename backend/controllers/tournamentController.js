const pool = require("../database/db");
const { getSudoku } = require("sudoku-gen");
const {generateTournamentPuzzle} = require("../controllers/puzzleController");


exports.getAllTournaments = async (req, res) => {
    try {
        // Fetch all tournaments ordered by creation date (newest first)
        const result = await pool.query(
            "SELECT * FROM tournaments ORDER BY created_at DESC"
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No tournaments found." });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getTournamentPlayers = async (req, res) => {
    try {
        const { id: tournamentId } = req.params; // Extract tournamentId from URL parameters

        if (!tournamentId) {
            return res.status(400).json({ error: "Tournament ID is required." });
        }
        const result = await pool.query(
            `SELECT users.id, users.username 
             FROM tournament_players 
             JOIN users ON tournament_players.user_id = users.id
             WHERE tournament_players.tournament_id = $1`,
            [tournamentId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tournament players:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

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
        console.log("starting tournament for id:");
        console.log(tournamentId);
        await pool.query("UPDATE tournaments SET status = 'in-progress' WHERE id = $1", [tournamentId]);

        // Get all players
        const playersRes = await pool.query(
            "SELECT user_id FROM tournament_players WHERE tournament_id = $1",
            [tournamentId]
        );

        const players = playersRes.rows.map(row => row.user_id);
        console.log("players");
        console.log(players);

        await generateTournamentMatches(tournamentId, players);

        console.log(`🎯 Tournament ${tournamentId} started!`);
    } catch (error) {
        console.error("❌ Error starting tournament", error);
    }
};

const generateTournamentMatches = async (tournamentId, players) => {
    try {
        let round = 1;
        let matchups = [...players];

        while (matchups.length > 1) {
            let newRound = [];
            
            for (let i = 0; i < matchups.length; i += 2) {
                if (i + 1 < matchups.length) {
                    const puzzle = await generateTournamentPuzzle();
                    const puzzle_id = puzzle.id;
                    // Create match for two players
                    await pool.query(
                        `INSERT INTO tournament_matches (tournament_id, round, player1_id, player2_id, puzzle_id)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [tournamentId, round, matchups[i], matchups[i + 1], puzzle_id]
                    );
                    newRound.push(matchups[i]); // Advance winner placeholder
                } else {
                    newRound.push(matchups[i]); // Odd player advances
                }
            }
            matchups = newRound;
            round++;
        }
    } catch (error) {
        console.error("Error generating tournament matches:", error);
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
            `SELECT tm.id, tm.round, 
                    u1.username AS player1_name, 
                    u2.username AS player2_name, 
                    tm.winner_id
             FROM tournament_matches tm
             LEFT JOIN users u1 ON tm.player1_id = u1.id
             LEFT JOIN users u2 ON tm.player2_id = u2.id
             WHERE tm.tournament_id = $1
             ORDER BY tm.round ASC`,
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
