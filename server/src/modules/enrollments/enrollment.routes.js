const express = require("express");
const enrollmentController = require("./enrollment.controller");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, enrollmentController.enrollProgram);
router.get("/my-programs", authenticate, enrollmentController.myPrograms);

module.exports = router;