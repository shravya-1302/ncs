const express = require("express");
const submissionController = require("./submission.controller");
const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, submissionController.submitTask);
router.get("/my", authenticate, submissionController.mySubmissions);
router.get("/lesson/:lessonId", authenticate, submissionController.lessonSubmission);

router.get(
  "/admin/all",
  authenticate,
  authorize("admin"),
  submissionController.adminSubmissions
);

router.patch(
  "/admin/:id/review",
  authenticate,
  authorize("admin"),
  submissionController.reviewSubmission
);

module.exports = router;