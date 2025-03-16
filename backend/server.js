require('dotenv').config();
const express = require("express");
const http = require('http');
const { configureMiddleware } = require("./middleware/middlewares");
const app = express();
const server = http.createServer(app);

// Apply middleware configurations
configureMiddleware(app);

// Initialize WebSocket
const socket = require("./socket");
socket.init(server);

// Use routes
const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const puzzleRoutes = require("./routes/puzzle");
app.use("/api/puzzle", puzzleRoutes);

const tournamentRoutes = require("./routes/tournament");
app.use("/api/tournament", tournamentRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
