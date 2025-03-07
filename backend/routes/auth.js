const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
  
    try {
      // Check if username is already taken
      const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: "Username is already taken" });
      }
  
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
        [username, hashedPassword]
      );
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.rows[0].id, username: newUser.rows[0].username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({ token:token, username:newUser.rows[0].username  });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
