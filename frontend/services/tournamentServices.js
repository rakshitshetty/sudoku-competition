const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const fetchTournamentList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert(" You need to log in to view tournament data!");
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/list`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Attach token
              },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        return null;
    }
}

export const fetchTournamentStatus = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to log in!");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/tournament/${id}/status`, {
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Attach token
        },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching tournament status:", error);
    return { success: false };
  }
};

export const fetchTournamentPlayers = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/tournament/${id}/players`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token
          },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching players:", error);
      return { success: false };
    }
};

export const fetchTournamentMatches = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/tournament/${id}/matches`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token
          },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching matches:", error);
      return { success: false };
    }
};

export const tournamentSignup = async (tournamentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/tournament/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token
          },
        body: JSON.stringify({ tournamentId }),
      });
      return await response;
    } catch (error) {
      console.error("Error signing up for tournament", error);
      return { success: false };
    }
};

export const createTournament = async (newTournament) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/tournament/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token
          },
          body: JSON.stringify(newTournament),
      });
      return await response;
    } catch (error) {
      console.error("Error signing up for tournament", error);
      return { success: false };
    }
};