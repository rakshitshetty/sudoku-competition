import { useState } from "react";
import { registerUser } from "../services/api";
import { useRouter } from "next/router";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(username, password);

    if (response.user) {
      setMessage("✅ Registration successful! You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(response.error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🆕 Register</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

const styles = { container: { textAlign: "center", padding: "20px" }, form: { display: "flex", flexDirection: "column", gap: "10px" }, message: { color: "green" } };

export default Register;
