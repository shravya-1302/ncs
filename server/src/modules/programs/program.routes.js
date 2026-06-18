const express = require("express");
const programController = require("./program.controller");
const { authenticate, authorize } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", programController.listPrograms);
router.get("/:id", programController.getProgram);

// Later only admin can create programs
router.post(
  "/",
  authenticate,
  authorize("admin"),
  programController.createProgram
);

module.exports = router;