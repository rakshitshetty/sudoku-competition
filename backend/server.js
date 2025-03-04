require("dotenv").config();
const express = require("express");
const http = require("http"); // HTTP server for WebSockets
const socketIo = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust for deployment
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// 🎯 **Emit Live Leaderboard Updates**
const updateLeaderboard = async () => {
  try {
    const leaderboard = await pool.query(
      `SELECT users.username, leaderboard.time_taken 
       FROM leaderboard 
       JOIN users ON leaderboard.user_id = users.id 
       ORDER BY leaderboard.time_taken ASC 
       LIMIT 10`
    );

    io.emit("leaderboardUpdate", leaderboard.rows); // Emit leaderboard updates
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
};


// 🎯 **Test Route**
app.get("/", (req, res) => {
  res.send("Sudoku Backend is Running 🚀");
});

// 🎯 **Fetch Daily Sudoku Puzzle**
app.get("/api/daily-puzzle", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM puzzles ORDER BY created_at DESC LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🎯 **Leaderboard Routes**
const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);

// 🎯 **User Routes**
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// 🎯 **Authentication Routes**
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

/*
// 🎯 **Submit Score & Trigger Leaderboard Update**
app.post("/api/submit-score", async (req, res) => {
  const { username, time_taken } = req.body;

  if (!username || !time_taken) {
    return res.status(400).json({ error: "Missing username or time_taken" });
  }

  try {
    // Fetch user_id using username
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    // Insert score into leaderboard
    await pool.query(
      "INSERT INTO leaderboard (user_id, time_taken) VALUES ($1, $2)",
      [userId, time_taken]
    );

    updateLeaderboard(); // 🔥 Emit real-time leaderboard update
    res.json({ message: "Score submitted successfully!" });
  } catch (err) {
    console.error("Error submitting score:", err);
    res.status(500).json({ error: "Error submitting score" });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.username, leaderboard.time_taken 
       FROM leaderboard 
       JOIN users ON leaderboard.user_id = users.id 
       ORDER BY leaderboard.time_taken ASC 
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

*/


// 🎯 **404 Route Handling**
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ **Start Server with WebSocket Support**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
