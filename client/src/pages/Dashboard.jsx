export default function Dashboard({ setPage, user }) {
  return (
    <div>
      <header style={styles.topbar}>
        <div>
          <p style={styles.eyebrow}>NEXT CHAPTER SKILLS</p>
          <h1 style={styles.title}>
            Welcome back, {user?.name || "Learner"}.
          </h1>
          <p style={styles.subtitle}>
            Build real projects, submit work, track progress, and earn verified credentials.
          </p>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase() || "N"}
          </div>
          <div>
            <strong>{user?.name || "Loading..."}</strong>
            <p style={styles.profileEmail}>{user?.email || ""}</p>
          </div>
        </div>
      </header>

      <section style={styles.hero}>
        <div>
          <span style={styles.heroBadge}>Career-ready learning</span>
          <h2 style={styles.heroTitle}>Learn. Build. Submit. Get reviewed.</h2>
          <p style={styles.heroText}>
            Your NCS dashboard brings programs, lessons, submissions, progress,
            and certificates into one professional workspace.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryBtn} onClick={() => setPage("programs")}>
              Explore Programs
            </button>

            <button style={styles.secondaryBtn} onClick={() => setPage("my-programs")}>
              Continue Learning
            </button>
          </div>
        </div>

        <div style={styles.heroMetricBox}>
          <div style={styles.metricBig}>3</div>
          <p>Active learning tracks available</p>
          <div style={styles.metricLine}></div>
          <span>Python · Web Dev · Cloud</span>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🎓</span>
          <h3>Programs</h3>
          <p>Explore structured career tracks.</p>
          <button onClick={() => setPage("programs")} style={styles.cardLink}>
            Browse now →
          </button>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>🚀</span>
          <h3>My Learning</h3>
          <p>Resume your enrolled programs.</p>
          <button onClick={() => setPage("my-programs")} style={styles.cardLink}>
            Continue →
          </button>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>📤</span>
          <h3>Submissions</h3>
          <p>Track submitted tasks and feedback.</p>
          <button onClick={() => setPage("my-submissions")} style={styles.cardLink}>
            View status →
          </button>
        </div>

        {user?.role === "admin" && (
          <div style={styles.adminCard}>
            <span style={styles.statIcon}>🛡️</span>
            <h3>Admin Review</h3>
            <p>Review student projects and submit feedback.</p>
            <button
              onClick={() => setPage("admin-submissions")}
              style={styles.adminLink}
            >
              Open Admin Panel →
            </button>
          </div>
        )}
      </section>

      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <h2>Recommended next steps</h2>

          <div style={styles.step}>
            <span style={styles.stepNumber}>01</span>
            <div>
              <strong>Complete your enrolled lessons</strong>
              <p>Open My Programs and continue your learning path.</p>
            </div>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>02</span>
            <div>
              <strong>Submit your project links</strong>
              <p>Every project submission helps build your portfolio.</p>
            </div>
          </div>

          <div style={styles.step}>
            <span style={styles.stepNumber}>03</span>
            <div>
              <strong>Wait for mentor/admin feedback</strong>
              <p>Accepted submissions unlock stronger certificate credibility.</p>
            </div>
          </div>
        </div>

        <div style={styles.panelDark}>
          <p style={styles.eyebrowLight}>NCS CAREER TRACK</p>
          <h2>Cloud Career Track</h2>
          <p>
            Premium track for AWS, Google Cloud, Azure, mock interviews, and job readiness.
          </p>
          <button style={styles.darkButton} onClick={() => setPage("programs")}>
            View Premium Track
          </button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    marginBottom: "28px",
  },
  eyebrow: {
    margin: 0,
    color: "#f59e0b",
    fontWeight: "900",
    letterSpacing: "2px",
    fontSize: "12px",
  },
  title: {
    margin: "8px 0",
    fontSize: "42px",
    lineHeight: "1.08",
    color: "#0f172a",
    letterSpacing: "-1px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
    maxWidth: "680px",
    lineHeight: "1.7",
  },
  profileCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    minWidth: "260px",
  },
  profileEmail: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },
  hero: {
    background:
      "linear-gradient(135deg, #111827 0%, #1e1b4b 55%, #7c2d12 100%)",
    color: "#fff",
    borderRadius: "28px",
    padding: "38px",
    display: "grid",
    gridTemplateColumns: "1.5fr 0.8fr",
    gap: "28px",
    boxShadow: "0 24px 60px rgba(15,23,42,0.22)",
  },
  heroBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(245,166,35,0.16)",
    color: "#fbbf24",
    fontWeight: "900",
    fontSize: "12px",
    letterSpacing: "1px",
  },
  heroTitle: {
    fontSize: "40px",
    lineHeight: "1.1",
    margin: "20px 0 14px",
    letterSpacing: "-1px",
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.8",
    maxWidth: "680px",
  },
  heroActions: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  primaryBtn: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#f5a623",
    color: "#111827",
    fontWeight: "900",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 22px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: "900",
    cursor: "pointer",
  },
  heroMetricBox: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    padding: "26px",
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  metricBig: {
    fontSize: "72px",
    fontWeight: "900",
    color: "#fbbf24",
    lineHeight: 1,
  },
  metricLine: {
    height: "1px",
    background: "rgba(255,255,255,0.16)",
    margin: "16px 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    marginTop: "28px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  adminCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    border: "1px solid rgba(124,58,237,0.25)",
  },
  statIcon: {
    fontSize: "28px",
  },
  cardLink: {
    marginTop: "10px",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: "900",
    cursor: "pointer",
    padding: 0,
  },
  adminLink: {
    marginTop: "10px",
    border: "none",
    background: "transparent",
    color: "#7c3aed",
    fontWeight: "900",
    cursor: "pointer",
    padding: 0,
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "18px",
    marginTop: "28px",
  },
  panel: {
    background: "#fff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },
  step: {
    display: "flex",
    gap: "16px",
    borderTop: "1px solid #eef2f7",
    padding: "18px 0",
  },
  stepNumber: {
    color: "#f59e0b",
    fontWeight: "900",
  },
  panelDark: {
    background: "#0f172a",
    color: "#fff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.14)",
  },
  eyebrowLight: {
    color: "#fbbf24",
    fontWeight: "900",
    letterSpacing: "2px",
    fontSize: "12px",
  },
  darkButton: {
    marginTop: "18px",
    padding: "13px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#f5a623",
    color: "#111827",
    fontWeight: "900",
    cursor: "pointer",
  },
};