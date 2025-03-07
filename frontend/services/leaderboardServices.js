const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  };
  