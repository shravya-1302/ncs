import { useEffect, useState } from "react";
import { api } from "../api/api";
import AdminSubmissions from "./AdminSubmissions";

function AdminDashboard({ setPage, user, activeTab, setActiveTab }) { 
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPrograms: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, appsRes, studentsRes, programsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/applications"),
        api.get("/admin/students"),
        api.get("/admin/programs"),
      ]);

      setStats(statsRes.data.data || {});
      setApplications(appsRes.data.data || []);
      setStudents(studentsRes.data.data || []);
      setPrograms(programsRes.data.data || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id) => {
    try {
      await api.patch(`/admin/applications/${id}/approve`);
      fetchAdminData();
    } catch (error) {
      console.error("Approve error:", error);
      alert("Failed to approve application");
    }
  };

  const rejectApplication = async (id) => {
    const remarks = window.prompt("Enter rejection reason") || "Rejected by admin";

    try {
      await api.patch(`/admin/applications/${id}/reject`, { remarks });
      fetchAdminData();
    } catch (error) {
      console.error("Reject error:", error);
      alert("Failed to reject application");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div style={pageWrap}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <p style={mutedText}>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <div style={headerRow}>
        <div>
          <h1 style={titleStyle}>Admin Dashboard</h1>
          <p style={mutedText}>
            Manage students, programs, applications, approvals and progress.
          </p>
        </div>

        <div style={adminBadge}>
          Signed in as <strong>{user?.name || "Admin"}</strong>
        </div>
      </div>

      

      {activeTab === "overview" && (
        <>
          <div style={statsGrid}>
            <StatCard
              label="Students Using App"
              value={stats.totalStudents || 0}
            />

            <StatCard
              label="Total Programs"
              value={stats.totalPrograms || 0}
            />

            <StatCard
              label="Pending Applications"
              value={stats.pendingApplications || 0}
            />

            <StatCard
              label="Approved Applications"
              value={stats.approvedApplications || 0}
            />

            <StatCard
              label="Rejected Applications"
              value={stats.rejectedApplications || 0}
            />
          </div>

          <div style={sectionCard}>
            <h2 style={sectionTitle}>Recent Program Applications</h2>
            <p style={mutedText}>
              Latest students who applied for programs/packages.
            </p>

            {applications.length === 0 ? (
              <p style={emptyText}>No applications found.</p>
            ) : (
              <div style={cardList}>
                {applications.slice(0, 5).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onApprove={approveApplication}
                    onReject={rejectApplication}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "applications" && (
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Program Applications</h2>
          <p style={mutedText}>
            See which student applied for which package, their current process,
            and approve or reject the application.
          </p>

          {applications.length === 0 ? (
            <p style={emptyText}>No program applications found.</p>
          ) : (
            <div style={cardList}>
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onApprove={approveApplication}
                  onReject={rejectApplication}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "students" && (
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Students</h2>
          <p style={mutedText}>
            View individual student progress and application summary.
          </p>

          {students.length === 0 ? (
            <p style={emptyText}>No students found.</p>
          ) : (
            <div style={tableWrap}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Applied Programs</th>
                    <th style={thStyle}>Approved</th>
                    <th style={thStyle}>Pending</th>
                    <th style={thStyle}>Latest Progress</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>
                        {student.total_applications || 0}
                      </td>
                      <td style={tdStyle}>
                        {student.approved_applications || 0}
                      </td>
                      <td style={tdStyle}>
                        {student.pending_applications || 0}
                      </td>
                      <td style={tdStyle}>
                        <span style={progressBadge}>
                          {student.latest_progress || "No progress yet"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "programs" && (
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Programs / Packages</h2>
          <p style={mutedText}>
            View all available programs/packages in the app.
          </p>

          {programs.length === 0 ? (
            <p style={emptyText}>No programs found.</p>
          ) : (
            <div style={programGrid}>
              {programs.map((program) => (
                <div key={program.id} style={programCard}>
                  <span style={categoryPill}>
                    {program.category || "Program"}
                  </span>

                  <h3 style={programTitle}>{program.title}</h3>

                  <p style={mutedText}>
                    {program.description || "No description available."}
                  </p>

                  <div style={programMeta}>
                    <span>Level</span>
                    <strong>{program.level || "N/A"}</strong>
                  </div>

                  <div style={programMeta}>
                    <span>Duration</span>
                    <strong>{program.duration || "N/A"}</strong>
                  </div>

                  <div style={priceText}>₹{program.price || 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "submissions" && (
        <div style={sectionCard}>
          <AdminSubmissions setPage={setPage} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <p style={statLabel}>{label}</p>
      <h2 style={statValue}>{value}</h2>
    </div>
  );
}

function ApplicationCard({ app, onApprove, onReject }) {
  return (
    <div style={applicationCard}>
      <div style={applicationTop}>
        <div>
          <h3 style={appTitle}>{app.program_title}</h3>
          <p style={mutedText}>
            {app.student_name} · {app.student_email}
          </p>
        </div>

        <span style={getStatusStyle(app.status)}>{app.status}</span>
      </div>

      <div style={detailsGrid}>
        <div>
          <p style={miniLabel}>Package</p>
          <strong>{app.program_title}</strong>
        </div>

        <div>
          <p style={miniLabel}>Price</p>
          <strong>₹{app.price || 0}</strong>
        </div>

        <div>
          <p style={miniLabel}>Duration</p>
          <strong>{app.duration || "N/A"}</strong>
        </div>

        <div>
          <p style={miniLabel}>Process</p>
          <strong>{app.progress || "applied"}</strong>
        </div>
      </div>

      {app.admin_remarks && (
        <p style={remarksText}>Admin remarks: {app.admin_remarks}</p>
      )}

      <div style={actionRow}>
        {app.status === "pending" ? (
          <>
            <button style={approveBtn} onClick={() => onApprove(app.id)}>
              Approve
            </button>

            <button style={rejectBtn} onClick={() => onReject(app.id)}>
              Reject
            </button>
          </>
        ) : (
          <span style={mutedText}>No action required</span>
        )}
      </div>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "approved") {
    return {
      ...statusPill,
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "rejected") {
    return {
      ...statusPill,
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  return {
    ...statusPill,
    background: "#fef3c7",
    color: "#92400e",
  };
}

const pageWrap = {
  padding: "38px",
  width: "100%",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
};

const titleStyle = {
  fontSize: "42px",
  margin: "0 0 8px",
  color: "#0f172a",
};

const mutedText = {
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: 0,
};

const adminBadge = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "14px 18px",
  color: "#334155",
};

const tabRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "24px",
};

const tabBtn = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#334155",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

const activeTabBtn = {
  ...tabBtn,
  background: "#27165c",
  color: "#fff",
  borderColor: "#27165c",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "18px",
  marginBottom: "26px",
};

const statCard = {
  background: "#fff",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  border: "1px solid #eef2f7",
};

const statLabel = {
  color: "#64748b",
  fontWeight: 700,
  margin: "0 0 12px",
};

const statValue = {
  color: "#0f172a",
  fontSize: "34px",
  margin: 0,
};

const sectionCard = {
  background: "#fff",
  borderRadius: "24px",
  padding: "26px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  border: "1px solid #eef2f7",
};

const sectionTitle = {
  margin: "0 0 8px",
  color: "#0f172a",
  fontSize: "28px",
};

const cardList = {
  display: "grid",
  gap: "16px",
  marginTop: "20px",
};

const applicationCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "20px",
  background: "#f8fafc",
};

const applicationTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "18px",
};

const appTitle = {
  margin: "0 0 6px",
  fontSize: "22px",
  color: "#0f172a",
};

const statusPill = {
  borderRadius: "999px",
  padding: "8px 12px",
  fontWeight: 800,
  textTransform: "capitalize",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px",
};

const miniLabel = {
  margin: "0 0 4px",
  color: "#94a3b8",
  fontWeight: 700,
  fontSize: "13px",
  textTransform: "uppercase",
};

const actionRow = {
  display: "flex",
  gap: "10px",
  marginTop: "18px",
};

const approveBtn = {
  border: "none",
  background: "#16a34a",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  fontWeight: 800,
  cursor: "pointer",
};

const rejectBtn = {
  border: "none",
  background: "#dc2626",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  fontWeight: 800,
  cursor: "pointer",
};

const remarksText = {
  margin: "14px 0 0",
  color: "#475569",
  background: "#fff",
  padding: "10px 12px",
  borderRadius: "10px",
};

const tableWrap = {
  overflowX: "auto",
  marginTop: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  background: "#0f172a",
  color: "#fff",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  color: "#334155",
};

const progressBadge = {
  background: "#ede9fe",
  color: "#5b21b6",
  padding: "7px 10px",
  borderRadius: "999px",
  fontWeight: 800,
};

const programGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "20px",
};

const programCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "22px",
  background: "#f8fafc",
};

const categoryPill = {
  display: "inline-block",
  background: "#fef3c7",
  color: "#92400e",
  padding: "7px 11px",
  borderRadius: "999px",
  fontWeight: 800,
  marginBottom: "12px",
};

const programTitle = {
  fontSize: "22px",
  margin: "0 0 10px",
  color: "#0f172a",
};

const programMeta = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "12px",
  marginTop: "12px",
  color: "#475569",
};

const priceText = {
  fontSize: "28px",
  fontWeight: 900,
  marginTop: "18px",
  color: "#0f172a",
};

const emptyText = {
  color: "#64748b",
  marginTop: "20px",
};

export default AdminDashboard;