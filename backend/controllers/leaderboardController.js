const pool = require("../database/db");
const socket = require("../socket");

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT leaderboard.id, users.username, leaderboard.time_taken 
       FROM leaderboard 
       JOIN users ON leaderboard.user_id = users.id 
       ORDER BY leaderboard.time_taken ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
};

exports.submitScore = async (req, res) => {
  const user_id = req.user.userId; // Get user_id from JWT
  const { time_taken } = req.body;

  if (!user_id || !time_taken) {
    return res.status(400).json({ error: "Missing user_id or time_taken" });
  }

  try {
    await pool.query("INSERT INTO leaderboard (user_id, time_taken) VALUES ($1, $2)", [
      user_id,
      time_taken,
    ]);

    // Emit leaderboard update to all connected clients
    const io = socket.getIo();
    io.emit("leaderboardUpdate");

    res.json({ message: "Score submitted successfully!" });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ error: "Error submitting score" });
  }
};
