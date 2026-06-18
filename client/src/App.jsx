import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import MyPrograms from "./pages/MyPrograms";
import Learning from "./pages/Learning";
import LessonPlayer from "./pages/LessonPlayer";
import MySubmissions from "./pages/MySubmissions";
import AdminSubmissions from "./pages/AdminSubmissions";
import AppLayout from "./components/AppLayout";
import { api } from "./api/api";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const token = localStorage.getItem("ncs_token");

  const [page, setPage] = useState(token ? "dashboard" : "login");
  const [user, setUser] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [learningProgramId, setLearningProgramId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [adminTab, setAdminTab] = useState("overview");

  useEffect(() => {
    async function fetchUser() {
      if (!localStorage.getItem("ncs_token")) return;

      try {
        const res = await api.get("/auth/me");
        const loggedInUser = res.data.user;

        setUser(loggedInUser);

        // IMPORTANT: after refresh, send admin to admin dashboard
        if (loggedInUser?.role === "admin") {
          setPage("admin-dashboard");
        } else {
          setPage("dashboard");
        }
      } catch (error) {
        localStorage.removeItem("ncs_token");
        localStorage.removeItem("ncs_user");
        setUser(null);
        setPage("login");
      }
    }

    fetchUser();
  }, []);

  if (page === "register") {
    return <Register setPage={setPage} setUser={setUser} />;
  }

  const handleLoginSuccess = (freshUser) => {
    setUser(freshUser);

    // IMPORTANT: admin and student should not go to same page
    if (freshUser?.role === "admin") {
  setAdminTab("overview");
  setPage("admin-dashboard");
} else {
  setPage("dashboard");
}
  };

  if (page === "login") {
    return <Login setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
<AppLayout
  user={user}
  setPage={setPage}
  activePage={page}
  adminTab={adminTab}
  setAdminTab={setAdminTab}
>      {page === "dashboard" && <Dashboard setPage={setPage} user={user} />}

      {page === "admin-submissions" && (
  <AdminSubmissions setPage={setPage} />
)}

      {page === "admin-dashboard" && (
  <AdminDashboard
    setPage={setPage}
    user={user}
    activeTab={adminTab}
    setActiveTab={setAdminTab}
  />
)}

      {page === "programs" && (
        <Programs
          setPage={setPage}
          setSelectedProgramId={setSelectedProgramId}
        />
      )}

      {page === "program-details" && (
        <ProgramDetails
          setPage={setPage}
          selectedProgramId={selectedProgramId}
        />
      )}

      {page === "my-programs" && (
        <MyPrograms
          setPage={setPage}
          setLearningProgramId={setLearningProgramId}
        />
      )}

      {page === "learning" && (
        <Learning
          setPage={setPage}
          learningProgramId={learningProgramId}
          setSelectedLessonId={setSelectedLessonId}
        />
      )}

      {page === "lesson-player" && (
        <LessonPlayer
          setPage={setPage}
          selectedLessonId={selectedLessonId}
        />
      )}

      {page === "my-submissions" && <MySubmissions setPage={setPage} />}

      {page === "admin-submissions" && (
        <AdminSubmissions setPage={setPage} user={user} />
      )}
    </AppLayout>
  );
}

export default App;