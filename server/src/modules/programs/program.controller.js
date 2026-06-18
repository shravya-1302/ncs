const programModel = require("./program.model");

async function listPrograms(req, res) {
  try {
    const programs = await programModel.getAllPrograms();

    return res.json({
      success: true,
      programs,
    });
  } catch (error) {
    console.error("List programs error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch programs.",
    });
  }
}

async function getProgram(req, res) {
  try {
    const program = await programModel.getProgramById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    return res.json({
      success: true,
      program,
    });
  } catch (error) {
    console.error("Get program error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch program.",
    });
  }
}

async function createProgram(req, res) {
  try {
    const {
      title,
      slug,
      description,
      domain,
      level,
      price,
      duration_days,
      thumbnail_url,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required.",
      });
    }

    const program = await programModel.createProgram({
      title,
      slug,
      description,
      domain,
      level,
      price,
      duration_days,
      thumbnail_url,
    });

    return res.status(201).json({
      success: true,
      message: "Program created successfully.",
      program,
    });
  } catch (error) {
    console.error("Create program error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Program slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not create program.",
    });
  }
}

module.exports = {
  listPrograms,
  getProgram,
  createProgram,
};