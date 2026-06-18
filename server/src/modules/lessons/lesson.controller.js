const lessonModel = require("./lesson.model");
const enrollmentModel = require("../enrollments/enrollment.model");

async function getProgramLessons(req, res) {
  try {
    const userId = req.user.id;
    const programId = req.params.programId;

    const enrollment = await enrollmentModel.findEnrollment(userId, programId);

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this program.",
      });
    }

    const modules = await lessonModel.getProgramModulesWithLessons(
      programId,
      userId
    );

    return res.json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("Get program lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch lessons.",
    });
  }
}

async function getLesson(req, res) {
  try {
    const userId = req.user.id;
    const lessonId = req.params.lessonId;

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

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Get lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch lesson.",
    });
  }
}

async function completeLesson(req, res) {
  try {
    const userId = req.user.id;
    const lessonId = req.params.lessonId;

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

    await lessonModel.markLessonCompleted({
      userId,
      lessonId,
      programId: lesson.program_id,
    });

    const totalLessons = await lessonModel.countProgramLessons(lesson.program_id);
    const completedLessons = await lessonModel.countCompletedLessons(
      userId,
      lesson.program_id
    );

    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await lessonModel.updateEnrollmentProgress(
      userId,
      lesson.program_id,
      progressPercent
    );

    return res.json({
      success: true,
      message: "Lesson marked as completed.",
      progress_percent: progressPercent,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not complete lesson.",
    });
  }
}

module.exports = {
  getProgramLessons,
  getLesson,
  completeLesson,
};