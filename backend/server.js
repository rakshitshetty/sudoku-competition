require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const http = require('http');

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

const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const puzzleRoutes = require("./routes/puzzle");
app.use("/api/puzzle", puzzleRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
