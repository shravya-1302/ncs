import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminSubmissions({ setPage }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMap, setFeedbackMap] = useState({});

  async function fetchSubmissions() {
    try {
      const res = await api.get("/submissions/admin/all");
      setSubmissions(res.data.submissions || []);
    } catch (error) {
      console.error("Fetch admin submissions error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Admin access required.");
        setPage("dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleFeedbackChange = (id, value) => {
    setFeedbackMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const reviewSubmission = async (id, status) => {
    try {
      await api.patch(`/submissions/admin/${id}/review`, {
        status,
        feedback: feedbackMap[id] || "",
      });

      await fetchSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Could not review submission.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Submission Review</h1>
          <p style={styles.subtitle}>Review student GitHub/project submissions.</p>
        </div>

        <button style={styles.backButton} onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p style={styles.centerText}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No submissions found</h2>
          <p>Student submissions will appear here.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {submissions.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <span style={styles.badge}>{item.status}</span>
                  <h2 style={styles.cardTitle}>
                    {item.lesson_title || "Program Submission"}
                  </h2>
                  <p style={styles.meta}>
                    {item.program_title} · {item.student_name} ({item.student_email})
                  </p>
                </div>
              </div>

              {item.github_link && (
                <a
                  href={item.github_link}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Open Student Submission
                </a>
              )}

              <div style={styles.infoRow}>
                <span>Submitted On</span>
                <strong>{new Date(item.submitted_at).toLocaleString()}</strong>
              </div>

              <textarea
                style={styles.textarea}
                placeholder="Write feedback for student..."
                defaultValue={item.feedback || ""}
                onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
              />

              <div style={styles.actions}>
                <button
                  style={styles.reviewButton}
                  onClick={() => reviewSubmission(item.id, "reviewed")}
                >
                  Mark Reviewed
                </button>

                <button
                  style={styles.acceptButton}
                  onClick={() => reviewSubmission(item.id, "accepted")}
                >
                  Accept
                </button>

                <button
                  style={styles.rejectButton}
                  onClick={() => reviewSubmission(item.id, "rejected")}
                >
                  Reject
                </button>
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
  centerText: {
    maxWidth: "1100px",
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
  list: {
    maxWidth: "1100px",
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
  meta: {
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
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  reviewButton: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#e5e7eb",
    fontWeight: "800",
    cursor: "pointer",
  },
  acceptButton: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },
};