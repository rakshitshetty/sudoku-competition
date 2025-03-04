import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaderboard");
        const data = await response.json();

        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        setError("Error loading leaderboard.");
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 Sudoku Leaderboard</h1>

      {loading ? (
        <p style={styles.loadingText}>Loading leaderboard...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : leaderboard.length === 0 ? (
        <p style={styles.emptyText}>No scores yet. Be the first to solve a puzzle!</p>
      ) : (
        <div style={styles.leaderboardBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Time (seconds)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} style={index === 0 ? styles.goldRow : {}}>
                  <td>🏅 {index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.time_taken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    maxWidth: "600px",
    margin: "50px auto",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  leaderboardBox: {
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
  },
  goldRow: {
    backgroundColor: "#FFD700",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#666",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#777",
  },
};

export default Leaderboard;
