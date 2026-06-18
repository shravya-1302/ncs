import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function MySubmissions({ setPage }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await api.get("/submissions/my");
        setSubmissions(res.data.submissions || []);
      } catch (error) {
        console.error("Fetch submissions error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("ncs_token");
          localStorage.removeItem("ncs_user");
          setPage("login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [setPage]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Submissions</h1>
          <p style={styles.subtitle}>Track your submitted tasks and project reviews.</p>
        </div>

        <button style={styles.backButton} onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p style={styles.centerText}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No submissions yet</h2>
          <p>Open a lesson and submit your GitHub/project link.</p>
          <button style={styles.primaryButton} onClick={() => setPage("my-programs")}>
            Go to My Programs
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {submissions.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <span style={styles.badge}>{item.status}</span>
                  <h2 style={styles.cardTitle}>{item.lesson_title || "Program Submission"}</h2>
                  <p style={styles.programName}>{item.program_title}</p>
                </div>
              </div>

              {item.github_link && (
                <a
                  href={item.github_link}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Open Submitted Link
                </a>
              )}

              <div style={styles.infoRow}>
                <span>Submitted On</span>
                <strong>{new Date(item.submitted_at).toLocaleString()}</strong>
              </div>

              <div style={styles.feedbackBox}>
                <strong>Feedback:</strong>
                <p>{item.feedback || "Not reviewed yet."}</p>
              </div>
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
    maxWidth: "1000px",
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
  centerText: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  emptyCard: {
    maxWidth: "560px",
    margin: "60px auto",
    background: "#fff",
    padding: "32px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#f5a623",
    fontWeight: "800",
    cursor: "pointer",
  },
  list: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gap: "18px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#fff3d6",
    color: "#a86400",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "capitalize",
  },
  cardTitle: {
    margin: "14px 0 4px",
    color: "#111827",
  },
  programName: {
    margin: 0,
    color: "#6b7280",
  },
  link: {
    display: "inline-block",
    marginTop: "18px",
    color: "#2563eb",
    fontWeight: "800",
    textDecoration: "none",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    padding: "14px 0",
    marginTop: "14px",
    fontSize: "14px",
  },
  feedbackBox: {
    background: "#f9fafb",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "14px",
    color: "#374151",
  },
};