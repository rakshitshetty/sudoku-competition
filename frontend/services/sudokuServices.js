const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const fetchDailyPuzzle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/puzzle/daily-puzzle`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      return null;
    }
  };
  
  export const submitSolution = async (timeTaken ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("UI submit score You need to log in to submit your score!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard/submit-score`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token
          },
        body: JSON.stringify({ time_taken: timeTaken  }),
      });
      return await response;
    } catch (error) {
      console.error("Error submitting solution:", error);
      return { success: false };
    }
  };
  