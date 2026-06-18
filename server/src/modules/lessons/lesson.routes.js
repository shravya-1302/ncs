const express = require("express");
const lessonController = require("./lesson.controller");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/program/:programId", authenticate, lessonController.getProgramLessons);
router.get("/:lessonId", authenticate, lessonController.getLesson);
router.patch("/:lessonId/complete", authenticate, lessonController.completeLesson);

module.exports = router;