import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Programs({ setPage, setSelectedProgramId }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await api.get("/programs");
        setPrograms(res.data.programs || []);
      } catch (error) {
        console.error("Fetch programs error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  const handleViewProgram = (programId) => {
    setSelectedProgramId(programId);
    setPage("program-details");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NCS Programs</h1>
          <p style={styles.subtitle}>Choose a program and start your learning journey.</p>
        </div>

        <button style={styles.backButton} onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading programs...</p>
      ) : (
        <div style={styles.grid}>
          {programs.map((program) => (
            <div key={program.id} style={styles.card}>
              <span style={styles.badge}>{program.domain}</span>

              <h2 style={styles.cardTitle}>{program.title}</h2>
              <p style={styles.description}>{program.description}</p>

              <div style={styles.infoRow}>
                <span>Level</span>
                <strong>{program.level}</strong>
              </div>

              <div style={styles.infoRow}>
                <span>Duration</span>
                <strong>{program.duration_days} days</strong>
              </div>

              <div style={styles.price}>
                ₹{Number(program.price).toLocaleString("en-IN")}
              </div>

              <button style={styles.button} onClick={() => handleViewProgram(program.id)}>
                View Program
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "40px",
  },
  header: {
    maxWidth: "1100px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    color: "#111827",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
  },
  backButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  loading: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#fff3d6",
    color: "#a86400",
    fontSize: "12px",
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: "22px",
    margin: "16px 0 10px",
    color: "#111827",
  },
  description: {
    color: "#555",
    minHeight: "48px",
    lineHeight: "1.5",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    padding: "12px 0",
    fontSize: "14px",
  },
  price: {
    fontSize: "26px",
    fontWeight: "800",
    marginTop: "10px",
    color: "#111827",
  },
  button: {
    marginTop: "16px",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#f5a623",
    fontWeight: "800",
    cursor: "pointer",
  },
};