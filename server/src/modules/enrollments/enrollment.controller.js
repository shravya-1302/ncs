const enrollmentModel = require("./enrollment.model");
const programModel = require("../programs/program.model");

async function enrollProgram(req, res) {
  try {
    const userId = req.user.id;
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required.",
      });
    }

    const program = await programModel.getProgramById(programId);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    const existing = await enrollmentModel.findEnrollment(userId, programId);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this program.",
      });
    }

    await enrollmentModel.createEnrollment(userId, programId);

    return res.status(201).json({
      success: true,
      message: "Enrollment successful.",
    });
  } catch (error) {
    console.error("Enroll program error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not enroll in program.",
    });
  }
}

async function myPrograms(req, res) {
  try {
    const programs = await enrollmentModel.getMyEnrollments(req.user.id);

    return res.json({
      success: true,
      programs,
    });
  } catch (error) {
    console.error("My programs error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch your programs.",
    });
  }
}

module.exports = {
  enrollProgram,
  myPrograms,
};