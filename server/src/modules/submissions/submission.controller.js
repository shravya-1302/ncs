const submissionModel = require("./submission.model");
const lessonModel = require("../lessons/lesson.model");
const enrollmentModel = require("../enrollments/enrollment.model");

async function submitTask(req, res) {
  try {
    const userId = req.user.id;
    const { lessonId, githubLink, fileUrl } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required.",
      });
    }

    if (!githubLink && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Please submit a GitHub link or file.",
      });
    }

    const lesson = await lessonModel.getLessonById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    const enrollment = await enrollmentModel.findEnrollment(
      userId,
      lesson.program_id
    );

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this program.",
      });
    }

    await submissionModel.createSubmission({
      userId,
      programId: lesson.program_id,
      lessonId,
      githubLink,
      fileUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Task submitted successfully.",
    });
  } catch (error) {
    console.error("Submit task error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not submit task.",
    });
  }
}

async function mySubmissions(req, res) {
  try {
    const submissions = await submissionModel.getMySubmissions(req.user.id);

    return res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("My submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch submissions.",
    });
  }
}

async function lessonSubmission(req, res) {
  try {
    const submission = await submissionModel.getSubmissionByLesson(
      req.user.id,
      req.params.lessonId
    );

    return res.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Lesson submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch lesson submission.",
    });
  }
}

async function adminSubmissions(req, res) {
  try {
    const submissions = await submissionModel.getAllSubmissions();

    return res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Admin submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch submissions.",
    });
  }
}

async function reviewSubmission(req, res) {
  try {
    const { status, feedback } = req.body;
    const submissionId = req.params.id;

    const allowedStatuses = ["reviewed", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status.",
      });
    }

    await submissionModel.reviewSubmission({
      submissionId,
      status,
      feedback,
    });

    return res.json({
      success: true,
      message: "Submission reviewed successfully.",
    });
  } catch (error) {
    console.error("Review submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not review submission.",
    });
  }
}

module.exports = {
  submitTask,
  mySubmissions,
  lessonSubmission,
  adminSubmissions,
  reviewSubmission,
};