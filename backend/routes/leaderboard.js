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

module.exports = router;
