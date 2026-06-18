import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function ProgramDetails({ setPage, selectedProgramId }) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await api.get(`/programs/${selectedProgramId}`);
        setProgram(res.data.program);
      } catch (error) {
        console.error("Fetch program details error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedProgramId) {
      fetchProgram();
    } else {
      setPage("programs");
    }
  }, [selectedProgramId, setPage]);

  const handleEnroll = async () => {
    setMessage("");
    setEnrolling(true);

    try {
      await api.post("/enrollments", {
        programId: selectedProgramId,
      });

      setMessage("Enrollment successful!");
      setTimeout(() => {
        setPage("my-programs");
      }, 600);
    } catch (error) {
      setMessage(error.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading program details...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Program not found</h2>
          <button style={styles.secondaryButton} onClick={() => setPage("programs")}>
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backButton} onClick={() => setPage("programs")}>
          ← Back to Programs
        </button>

        <span style={styles.badge}>{program.domain}</span>

        <h1 style={styles.title}>{program.title}</h1>
        <p style={styles.description}>{program.description}</p>

        <div style={styles.infoGrid}>
          <div style={styles.infoBox}>
            <span>Level</span>
            <strong>{program.level}</strong>
          </div>

          <div style={styles.infoBox}>
            <span>Duration</span>
            <strong>{program.duration_days} days</strong>
          </div>

          <div style={styles.infoBox}>
            <span>Price</span>
            <strong>₹{Number(program.price).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div style={styles.section}>
          <h3>What you will get</h3>
          <ul style={styles.list}>
            <li>Recorded lessons</li>
            <li>Practical assignments</li>
            <li>Mini project</li>
            <li>Completion certificate</li>
            <li>Dashboard progress tracking</li>
          </ul>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        <button style={styles.enrollButton} onClick={handleEnroll} disabled={enrolling}>
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "820px",
    background: "#fff",
    borderRadius: "18px",
    padding: "34px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
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
  title: {
    fontSize: "38px",
    lineHeight: "1.2",
    margin: "16px 0",
    color: "#111827",
  },
  description: {
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#4b5563",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    margin: "28px 0",
  },
  infoBox: {
    background: "#f9fafb",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  section: {
    marginTop: "20px",
  },
  list: {
    lineHeight: "1.9",
    color: "#374151",
  },
  message: {
    marginTop: "18px",
    fontWeight: "700",
    color: "#2563eb",
  },
  enrollButton: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#f5a623",
    color: "#111827",
    fontWeight: "900",
    fontSize: "16px",
    cursor: "pointer",
  },
};