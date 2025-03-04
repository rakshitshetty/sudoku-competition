const { Pool } = require("pg");

// Configure PostgreSQL connection
const pool = new Pool({
  user: "sudoku_user", // Change if your username is different
  host: "localhost",
  database: "sudoku",
  password: "sudoku_pass", // Ensure this matches the actual password
  port: 5432,
});

module.exports = pool;
