import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/Leaderboard.module.css";

const socket = io("http://localhost:5000");

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaderboard");
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();

    // Listen for real-time leaderboard updates
    socket.on("leaderboardUpdate", fetchLeaderboard);

    return () => {
      socket.off("leaderboardUpdate", fetchLeaderboard);
    };
  }, []);

  return (
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.title}>🏆 Leaderboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr><td colSpan="3">No scores yet. Be the first to solve a puzzle!</td></tr>
          ) : (
            leaderboard.map((entry, index) => (
              <tr key={index} className={index === 0 ? styles.goldRow : ""}>
                <td>🏅 {index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.time_taken}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
