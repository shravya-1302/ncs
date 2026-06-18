const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const authRoutes = require("./modules/auth/auth.routes");
const programRoutes = require("./modules/programs/program.routes");
const enrollmentRoutes = require("./modules/enrollments/enrollment.routes");
const lessonRoutes = require("./modules/lessons/lesson.routes");
const submissionRoutes = require("./modules/submissions/submission.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NCS backend API is running",
    port: process.env.PORT || 6001,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NCS server healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`NCS backend running on http://localhost:${PORT}`);
});