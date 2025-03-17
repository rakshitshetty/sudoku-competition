const pool = require("../database/db");
const { getSudoku } = require("sudoku-gen");

// Get daily puzzle (unchanged)
exports.getDailyPuzzle = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM puzzles ORDER BY created_at DESC LIMIT 1");
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate a unique Sudoku puzzle for a tournament match
exports.generateTournamentPuzzle = async (matchId) => {
    try {
      const difficulty = "hard"; 
      
      // Generate puzzle
      const sudokuData = getSudoku(difficulty);

      // Convert the string format into a 9x9 integer array
      const convertToGrid = (str) => {
          return Array.from({ length: 9 }, (_, row) =>
              str.slice(row * 9, (row + 1) * 9).split("").map(char => (char === "-" ? 0 : parseInt(char)))
          );
      };

      const puzzleGrid = convertToGrid(sudokuData.puzzle);
      const solutionGrid = convertToGrid(sudokuData.solution);

      // Store in PostgreSQL as JSON
      const puzzleJson = JSON.stringify(puzzleGrid);
      const solutionJson = JSON.stringify(solutionGrid);

        // Store in DB
        const result = await pool.query(
            "INSERT INTO puzzles (puzzle, solution, difficulty, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
            [puzzleJson, solutionJson, difficulty]
        );
        return result.rows[0]; // Return the stored puzzle
    } catch (error) {
        console.error("Error generating tournament puzzle:", error);
        throw error;
    }
};

// Get the puzzle assigned to a specific match
exports.getTournamentPuzzle = async (req, res) => {
    const { matchId } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM puzzles WHERE tournament_match_id = $1",
            [matchId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No puzzle found for this match." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate a new Sudoku puzzle based on difficulty
exports.generateSudokuPuzzle = async (req, res) => {
  try {
    const difficulty = req.params.difficulty?.toString().toLowerCase(); 
    
    // Ensure difficulty is one of the expected values
      const validDifficulties = ["easy", "medium", "hard", "expert"];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(404).json({ error: `Invalid difficulty level: ${difficulty}. Choose from ${validDifficulties.join(", ")}` });
      }
    
      // Generate puzzle
      const sudokuData = getSudoku(difficulty);
      console.log("Generated Sudoku Data:", sudokuData);

      // Convert the string format into a 9x9 integer array
      const convertToGrid = (str) => {
          return Array.from({ length: 9 }, (_, row) =>
              str.slice(row * 9, (row + 1) * 9).split("").map(char => (char === "-" ? 0 : parseInt(char)))
          );
      };

      const puzzleGrid = convertToGrid(sudokuData.puzzle);
      const solutionGrid = convertToGrid(sudokuData.solution);

      // Store in PostgreSQL as JSON
      const puzzleJson = JSON.stringify(puzzleGrid);
      const solutionJson = JSON.stringify(solutionGrid);

      // Store in DB
      const result = await pool.query(
          "INSERT INTO puzzles (puzzle, solution, difficulty, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
          [puzzleJson, solutionJson, difficulty]
      );

      res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPuzzleByDifficulty = async (req, res) => {
  const { difficulty } = req.params;

  try {
      const result = await pool.query(
          "SELECT * FROM puzzles WHERE difficulty = $1 ORDER BY created_at DESC LIMIT 1",
          [difficulty]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ error: "No puzzle found for this difficulty." });
      }

      res.json(result.rows[0]);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
