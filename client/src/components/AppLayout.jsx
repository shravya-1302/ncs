export default function AppLayout({
  children,
  user,
  setPage,
  activePage,
  adminTab,
  setAdminTab,
}) {
  const isAdmin = user?.role === "admin";

  const goAdminTab = (tab) => {
    if (setAdminTab) {
      setAdminTab(tab);
    }
    setPage("admin-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("ncs_token");
    localStorage.removeItem("ncs_user");
    setPage("login");
  };

  const navButton = (label, pageName) => (
    <button
      style={activePage === pageName ? styles.navActive : styles.navItem}
      onClick={() => setPage(pageName)}
    >
      {label}
    </button>
  );

  const adminNavButton = (label, tabName) => (
    <button
      style={
        activePage === "admin-dashboard" && adminTab === tabName
          ? styles.navAdminActive
          : styles.navAdmin
      }
      onClick={() => goAdminTab(tabName)}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.logo}>N</div>
            <div>
              <h2 style={styles.brandTitle}>NCS</h2>
              <p style={styles.brandSub}>Learning Platform</p>
            </div>
          </div>

          <nav style={styles.nav}>
            {isAdmin ? (
              <>
                {adminNavButton("Overview", "overview")}
                {adminNavButton("Program Applications", "applications")}
                {adminNavButton("Students", "students")}
                {adminNavButton("Programs", "programs")}
                {adminNavButton("Project Submissions", "submissions")}
              </>
            ) : (
              <>
                {navButton("Dashboard", "dashboard")}
                {navButton("Explore Programs", "programs")}
                {navButton("My Programs", "my-programs")}
                {navButton("My Submissions", "my-submissions")}
              </>
            )}
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <p style={styles.smallLabel}>Signed in as</p>
          <strong>{user?.role || "student"}</strong>
          <p style={styles.userEmail}>{user?.email || ""}</p>

          <button style={styles.logoutMini} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    background: "#f4f6fb",
  },
  sidebar: {
    background: "#0f172a",
    color: "#fff",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #f5a623, #ffcf6a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "24px",
    color: "#111827",
  },
  brandTitle: {
    margin: 0,
    fontSize: "22px",
  },
  brandSub: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  nav: {
    display: "grid",
    gap: "10px",
    marginTop: "40px",
  },
  navItem: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid transparent",
    background: "transparent",
    color: "#cbd5e1",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "700",
  },
  navActive: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(245,166,35,0.4)",
    background: "rgba(245,166,35,0.14)",
    color: "#fbbf24",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "800",
  },
  navAdmin: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(124,58,237,0.5)",
    background: "rgba(124,58,237,0.18)",
    color: "#ddd6fe",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "800",
  },
  navAdminActive: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(196,181,253,0.7)",
    background: "rgba(124,58,237,0.38)",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "900",
  },
  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: "18px",
    color: "#cbd5e1",
  },
  smallLabel: {
    margin: "0 0 6px",
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  userEmail: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    wordBreak: "break-word",
  },
  logoutMini: {
    marginTop: "14px",
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
  },
  main: {
    padding: "34px",
    overflow: "auto",
  },
};