import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function LessonPlayer({ setPage, selectedLessonId }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState("");
  const [githubLink, setGithubLink] = useState("");
const [submissionMessage, setSubmissionMessage] = useState("");
const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await api.get(`/lessons/${selectedLessonId}`);
        setLesson(res.data.lesson);
      } catch (error) {
        console.error("Fetch lesson error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("ncs_token");
          localStorage.removeItem("ncs_user");
          setPage("login");
        }
      } finally {
        setLoading(false);
      }
    }

    if (selectedLessonId) {
      fetchLesson();
    } else {
      setPage("my-programs");
    }
  }, [selectedLessonId, setPage]);

  const handleComplete = async () => {
    setMessage("");
    setCompleting(true);

    try {
      const res = await api.patch(`/lessons/${selectedLessonId}/complete`);

      setMessage(
        `Lesson completed. Progress is now ${res.data.progress_percent}%.`
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not complete lesson.");
    } finally {
      setCompleting(false);
    }
  };
const handleSubmitTask = async (e) => {
  e.preventDefault();
  setSubmissionMessage("");
  setSubmitting(true);

  try {
    await api.post("/submissions", {
      lessonId: selectedLessonId,
      githubLink,
    });

    setSubmissionMessage("Task submitted successfully.");
    setGithubLink("");
  } catch (error) {
    setSubmissionMessage(
      error.response?.data?.message || "Could not submit task."
    );
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Lesson not found</h2>
          <button style={styles.backButton} onClick={() => setPage("my-programs")}>
            Back to My Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backButton} onClick={() => setPage("learning")}>
          ← Back to Lessons
        </button>

        <p style={styles.breadcrumb}>
          {lesson.program_title} / {lesson.module_title}
        </p>

        <h1 style={styles.title}>{lesson.title}</h1>

        <div style={styles.videoBox}>
          {lesson.video_url ? (
            <video controls style={styles.video}>
              <source src={lesson.video_url} />
              Your browser does not support video.
            </video>
          ) : (
            <div style={styles.videoPlaceholder}>
              Video will be added here later using AWS S3.
            </div>
          )}
        </div>

        <div style={styles.contentBox}>
          <h2>Lesson Content</h2>
          <p style={styles.content}>{lesson.content}</p>
        </div>
        <form style={styles.submitBox} onSubmit={handleSubmitTask}>
  <h2>Submit Task / Project</h2>
  <p style={styles.smallText}>
    Paste your GitHub repository link or project link for this lesson.
  </p>

  <input
    style={styles.input}
    value={githubLink}
    onChange={(e) => setGithubLink(e.target.value)}
    placeholder="https://github.com/username/project"
  />

  {submissionMessage && (
    <p style={styles.message}>{submissionMessage}</p>
  )}

  <button style={styles.submitButton} disabled={submitting}>
    {submitting ? "Submitting..." : "Submit Task"}
  </button>
</form>

        {lesson.notes_url && (
          <a
            href={lesson.notes_url}
            target="_blank"
            rel="noreferrer"
            style={styles.notesButton}
          >
            Open Notes
          </a>
        )}

        {message && <p style={styles.message}>{message}</p>}

        <button
          style={styles.completeButton}
          onClick={handleComplete}
          disabled={completing}
        >
          {completing ? "Updating..." : "Mark as Completed"}
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
    maxWidth: "900px",
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
    marginBottom: "16px",
  },
  breadcrumb: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 8px",
  },
  title: {
    fontSize: "36px",
    color: "#111827",
    margin: "0 0 24px",
  },
  videoBox: {
    background: "#111827",
    borderRadius: "16px",
    minHeight: "280px",
    overflow: "hidden",
    marginBottom: "24px",
  },
  video: {
    width: "100%",
    display: "block",
  },
  videoPlaceholder: {
    minHeight: "280px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
  },
  contentBox: {
    background: "#f9fafb",
    border: "1px solid #eee",
    borderRadius: "14px",
    padding: "20px",
  },
  content: {
    color: "#374151",
    lineHeight: "1.8",
  },
  notesButton: {
    display: "inline-block",
    marginTop: "18px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#e5e7eb",
    color: "#111827",
    textDecoration: "none",
    fontWeight: "800",
  },
  message: {
    marginTop: "18px",
    color: "#2563eb",
    fontWeight: "800",
  },
  completeButton: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#f5a623",
    color: "#111827",
    fontWeight: "900",
    cursor: "pointer",
  },
  submitBox: {
  marginTop: "24px",
  background: "#fff7e6",
  border: "1px solid #f5d28c",
  borderRadius: "14px",
  padding: "20px",
},
smallText: {
  color: "#6b7280",
  lineHeight: "1.6",
},
input: {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
},
submitButton: {
  marginTop: "14px",
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
},
};