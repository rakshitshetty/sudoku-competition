const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const loginUser = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

  export const signupUser = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Signup request failed", error);
      return { error: "Something went wrong. Please try again." };
    }
  };
  


