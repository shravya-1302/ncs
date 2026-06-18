import { useState } from "react";
import { api } from "../api/api";

export default function Login({ setPage }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("ncs_token", res.data.token);
      localStorage.setItem("ncs_user", JSON.stringify(res.data.user));

      setMessage("Login successful!");
      setPage("dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Login to NCS</h2>

        {message && <p style={styles.message}>{message}</p>}

        <input
          style={styles.input}
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.linkText}>
          New to NCS?{" "}
          <button type="button" style={styles.link} onClick={() => setPage("register")}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f7fb",
  },
  card: {
    width: "380px",
    padding: "28px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#f5a623",
    color: "#111",
    fontWeight: "700",
    cursor: "pointer",
  },
  message: {
    fontSize: "14px",
    color: "#d9534f",
  },
  linkText: {
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    border: "none",
    background: "transparent",
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "700",
  },
};