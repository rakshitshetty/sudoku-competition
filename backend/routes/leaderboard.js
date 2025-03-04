const express = require("express");
const router = express.Router();
const pool = require("../database/db");
/*
// Get Leaderboard Rankings (Top 10 players)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.username, leaderboard.time_taken, leaderboard.completed_at
       FROM leaderboard
       JOIN users ON leaderboard.user_id = users.id
       ORDER BY leaderboard.time_taken ASC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new score to the leaderboard
router.post("/", async (req, res) => {
  const { user_id, time_taken } = req.body;

  // Ensure required data is provided
  if (!user_id || !time_taken) {
    return res.status(400).json({ error: "User ID and time taken required" });
  }

  try {
    await pool.query(
      "INSERT INTO leaderboard (user_id, time_taken) VALUES ($1, $2)",
      [user_id, time_taken]
    );

    res.json({ message: "Score added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

module.exports = router;
