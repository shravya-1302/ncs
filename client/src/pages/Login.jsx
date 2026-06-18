import { useState } from "react";
import { api } from "../api/api";
import PasswordInput from "../components/PasswordInput";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("ncs_user", JSON.stringify(res.data.user));

      setPage("dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>N</div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to continue your NCS learning journey.</p>

        <form style={styles.form} onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {message && <p style={styles.message}>{message}</p>}

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <button style={styles.linkButton} onClick={() => setPage("register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(245,166,35,0.16), transparent 30%), #f4f6fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#fff",
    padding: "36px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
  },
  logo: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "#f5a623",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "28px",
    marginBottom: "22px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
    color: "#0f172a",
  },
  subtitle: {
    margin: "10px 0 26px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
  },
  message: {
    margin: 0,
    color: "#dc2626",
    fontWeight: "700",
    fontSize: "14px",
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#f5a623",
    color: "#111827",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "16px",
  },
  footerText: {
    margin: "22px 0 0",
    textAlign: "center",
    color: "#64748b",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "900",
    cursor: "pointer",
  },
};