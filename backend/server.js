require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { Pool } = require('pg');
const http = require('http');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const socket = require("./socket");
socket.init(server);

app.use(cors({
  origin: "http://localhost:3000", // ✅ Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // ✅ Allow cookies and authentication headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Sudoku Backend is Running 🚀');
});

// Fetch Daily Sudoku Puzzle
app.get('/api/daily-puzzle', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM puzzles ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ error: "Username and password required" });
//   }

//   try {
//     const userQuery = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//     const user = userQuery.rows[0];

//     if (!user) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.json({ token:token, username:user.username });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
