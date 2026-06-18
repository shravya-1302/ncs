import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Learning({
  setPage,
  learningProgramId,
  setSelectedLessonId,
}) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await api.get(`/lessons/program/${learningProgramId}`);
        setModules(res.data.modules || []);
      } catch (error) {
        console.error("Fetch lessons error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("ncs_token");
          localStorage.removeItem("ncs_user");
          setPage("login");
        }
      } finally {
        setLoading(false);
      }
    }

    if (learningProgramId) {
      fetchLessons();
    } else {
      setPage("my-programs");
    }
  }, [learningProgramId, setPage]);

  const openLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setPage("lesson-player");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Learning Space</h1>
          <p style={styles.subtitle}>Complete your modules and lessons step by step.</p>
        </div>

        <button style={styles.backButton} onClick={() => setPage("my-programs")}>
          Back to My Programs
        </button>
      </div>

      {loading ? (
        <p style={styles.centerText}>Loading lessons...</p>
      ) : modules.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No lessons found</h2>
          <p>This program does not have lessons yet.</p>
        </div>
      ) : (
        <div style={styles.moduleWrap}>
          {modules.map((module) => (
            <div key={module.id} style={styles.moduleCard}>
              <h2 style={styles.moduleTitle}>{module.title}</h2>

              {module.lessons.length === 0 ? (
                <p style={styles.noLesson}>No lessons added yet.</p>
              ) : (
                <div style={styles.lessonList}>
                  {module.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      style={styles.lessonButton}
                      onClick={() => openLesson(lesson.id)}
                    >
                      <span style={styles.lessonNumber}>{index + 1}</span>
                      <span>
  {lesson.title} {lesson.is_completed ? "✅" : ""}
</span>
                    </button>
                  ))}
                </div>
              )}
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
  moduleWrap: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gap: "18px",
  },
  moduleCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  moduleTitle: {
    margin: "0 0 16px",
    color: "#111827",
  },
  noLesson: {
    color: "#6b7280",
  },
  lessonList: {
    display: "grid",
    gap: "10px",
  },
  lessonButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontWeight: "700",
    textAlign: "left",
  },
  lessonNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f5a623",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    fontWeight: "900",
  },
};