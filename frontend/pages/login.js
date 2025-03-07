import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import { loginUser } from "../services/authServices";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = await loginUser(formData);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/");
    } else {
      setError(data.error || "Invalid credentials");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>🔐 Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginBtn}>
            Sign In
          </button>
        </form>
        <p className={styles.switch}>
          Don’t have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
