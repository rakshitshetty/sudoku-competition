import { useState, useEffect, useContext } from "react";
import styles from "../styles/Sudoku.module.css";
import AuthContext from "../context/AuthContext";
import { fetchDailyPuzzle, submitSolution } from "../services/sudokuServices";

const Sudoku = () => {
  const { user } = useContext(AuthContext);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [userInput, setUserInput] = useState({});
  const [isSolved, setIsSolved] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [shakeCells, setShakeCells] = useState({});
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchPuzzle = async () => {
      const data = await fetchDailyPuzzle();
      setPuzzle(data.puzzle);
      setSolution(data.solution);
      setStartTime(Date.now());
    };

    fetchPuzzle();
  }, []);

  const submitScore = async (timeTaken) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("UI submit score You need to log in to submit your score!");
      return;
    }

    const response = await submitSolution(timeTaken);

    if (response.ok) {
      alert(`🎉 Congratulations! You solved the puzzle in ${timeTaken} seconds.`);
      setIsSolved(true);
    } else {
      alert("Error submitting score.");
    }
  };

  const handleChange = (row, col, value) => {
    if (!isSolved && puzzle[row][col] === 0) {
      const key = `${row}-${col}`;
      setUserInput((prev) => ({ ...prev, [key]: value }));

      if (parseInt(value, 10) !== solution[row][col]) {
        setShakeCells((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setShakeCells((prev) => ({ ...prev, [key]: false }));
        }, 500);
      }

      if (true || Object.keys(userInput).length + 1 === puzzle.flat().filter((num) => num === 0).length) {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        submitScore(timeTaken);
      }
    }
  };

  const handleCellClick = (row, col) => {
    const key = `${row}-${col}`;
    const fixedValue = puzzle[row][col] !== 0 ? puzzle[row][col] : null; // Get fixed value if exists
    const userEnteredValue = userInput[key] ? parseInt(userInput[key], 10) : null; // Get user-entered value if exists
    
    // Select the value that exists (fixed first, then user-entered)
    const selectedNum = fixedValue !== null ? fixedValue : userEnteredValue;
    
    if (selectedNum !== null) {
      setSelectedCell({ row, col });
      setSelectedValue(selectedNum); // 🔥 Ensure selectedValue gets stored properly
    }
  };
  
  return (
    <div className={styles.sudokuContainer}>
      <h1 className={styles.title}>🧩 Daily Sudoku</h1>
      <div className={styles.grid}>
        {puzzle &&
          puzzle.map((row, rowIndex) =>
            row.map((num, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const isHighlighted = selectedCell && (selectedCell.row === rowIndex || selectedCell.col === colIndex);
              const isWrong = userInput[key] && parseInt(userInput[key], 10) !== solution[rowIndex][colIndex];
              const isSameNumber = selectedValue !== null && (puzzle[rowIndex][colIndex] === selectedValue || parseInt(userInput[key], 10) === selectedValue); // 🔥 Includes both fixed and user-input numbers


              return (
                <div
                key={key}
                onClick={() => handleCellClick(rowIndex, colIndex, num || userInput[key])} // 🔥 Ensure user inputs are considered
                className={`${styles.cell} ${isHighlighted ? styles.highlighted : ""} ${isSameNumber ? styles.sameNumber : ""} ${isWrong ? styles.wrong : ""} ${shakeCells[key] ? styles.shake : ""}`}
                style={{ fontSize: isSameNumber ? "26px" : "22px", fontWeight: isSameNumber ? "bold" : "normal" }}
              >
                {puzzle[rowIndex][colIndex] !== 0 ? (
                puzzle[rowIndex][colIndex]
                  ) : (
                    <input
                    type="text"
                    maxLength="1"
                    value={userInput[key] || ""}
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 Prevent click from resetting highlighting
                      handleCellClick(rowIndex, colIndex);
                    }}
                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                    disabled={isSolved}
                    className={styles.input}
                    style={{ fontSize: isSameNumber ? "26px" : "22px", fontWeight: isSameNumber ? "bold" : "normal" }}
                  />
                  )}
                </div>
              );
            })
          )}
      </div>
    </div>
  );
};

export default Sudoku;
