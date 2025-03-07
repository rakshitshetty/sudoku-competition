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

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const puzzleRoutes = require("./routes/puzzle");
app.use("/api/puzzle", puzzleRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Sudoku Backend is Running 🚀');
}); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
