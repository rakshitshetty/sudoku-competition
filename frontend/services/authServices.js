const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const loginUser = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      return await response.json();
    } catch (error) {
      console.error("Login request failed", error);
      return { error: "Something went wrong. Please try again." };
    }
  };


