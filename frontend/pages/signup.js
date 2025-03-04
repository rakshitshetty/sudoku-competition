import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", formData.username);
        router.push("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>📝 Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginBtn}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;  // ✅ Make sure this is present!
