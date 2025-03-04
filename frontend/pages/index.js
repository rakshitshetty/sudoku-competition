import { useEffect, useState } from "react";
import Sudoku from "../components/Sudoku";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div style={styles.pageContainer}>
        <Navbar />
        <div style={styles.gameContainer}>
          <Sudoku />
          <Leaderboard />
        </div>
      </div>
    )
  );
};

const styles = {
  pageContainer: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" },
  gameContainer: { display: "flex", justifyContent: "center", gap: "40px", padding: "20px" },
};

export default Home;
