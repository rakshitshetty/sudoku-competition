const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Fetch leaderboard with user names instead of just user_id
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT leaderboard.id, users.username, leaderboard.time_taken
      FROM leaderboard
      JOIN users ON leaderboard.user_id = users.id
      ORDER BY leaderboard.time_taken ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Error fetching leaderboard" });
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


module.exports = router;
