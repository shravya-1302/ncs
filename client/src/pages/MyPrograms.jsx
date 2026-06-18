import { useEffect, useState } from "react";
import { api } from "../api/api";

function ProgressCircle({ percent = 0 }) {
  const radius = 42;
  const stroke = 9;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div style={styles.circleWrap}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#f5a623"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.4s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      <div style={styles.circleText}>
        <strong>{percent}%</strong>
        <span>Done</span>
      </div>
    </div>
  );
}

export default function MyPrograms({ setPage, setLearningProgramId }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyPrograms() {
      try {
        const res = await api.get("/enrollments/my-programs");
        setPrograms(res.data.programs || []);
      } catch (error) {
        console.error("Fetch my programs error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("ncs_token");
          localStorage.removeItem("ncs_user");
          setPage("login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMyPrograms();
  }, [setPage]);

  const startLearning = (programId) => {
    setLearningProgramId(programId);
    setPage("learning");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Programs</h1>
          <p style={styles.subtitle}>Your enrolled NCS learning programs.</p>
        </div>

        <button style={styles.backButton} onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p style={styles.centerText}>Loading your programs...</p>
      ) : programs.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No enrolled programs yet</h2>
          <p>Explore programs and enroll to start learning.</p>
          <button style={styles.primaryButton} onClick={() => setPage("programs")}>
            Browse Programs
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {programs.map((item) => {
            const progress = Number(item.progress_percent || 0);

            return (
              <div key={item.enrollment_id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <span style={styles.badge}>{item.domain}</span>
                    <h2 style={styles.cardTitle}>{item.title}</h2>
                  </div>

                  <ProgressCircle percent={progress} />
                </div>

                <p style={styles.description}>{item.description}</p>

                <div style={styles.infoRow}>
                  <span>Status</span>
                  <strong>{item.payment_status}</strong>
                </div>

                <div style={styles.infoRow}>
                  <span>Level</span>
                  <strong>{item.level}</strong>
                </div>

                <div style={styles.infoRow}>
                  <span>Duration</span>
                  <strong>{item.duration_days} days</strong>
                </div>

                <button
                  style={styles.button}
                  onClick={() => startLearning(item.program_id)}
                >
                  Start Learning
                </button>
              </div>
            );
          })}
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
  primaryButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#f5a623",
    fontWeight: "800",
    cursor: "pointer",
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "12px",
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
    margin: "14px 0 0",
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
    textTransform: "capitalize",
  },
  button: {
    marginTop: "16px",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },
  circleWrap: {
    width: "84px",
    height: "84px",
    position: "relative",
    flexShrink: 0,
  },
  circleText: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#6b7280",
  },
};