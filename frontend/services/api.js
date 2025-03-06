const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const fetchDailyPuzzle = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-puzzle`);
    if (!response.ok) {
      throw new Error("Failed to fetch the daily puzzle");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return null;
  }
};

const API_URL = "http://localhost:5000/api";

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token); // Store token after login
  }
  return data;
};

export const submitScore = async (time_taken) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not logged in!");
  }

  const response = await fetch(`${API_URL}/submit-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Attach token
    },
    body: JSON.stringify({ time_taken }),
  });

  return response.json();
};
