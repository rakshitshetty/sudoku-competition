const pool = require("../database/db");

exports.getDailyPuzzle = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM puzzles ORDER BY created_at DESC LIMIT 1');
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
