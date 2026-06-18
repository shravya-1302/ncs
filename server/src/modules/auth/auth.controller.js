const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("./auth.model");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

async function register(req, res) {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await authModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await authModel.createUser({
      name,
      email,
      phone,
      passwordHash,
      role: role === "admin" ? "admin" : "student",
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Registered successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_verified: user.is_verified,
      created_at: user.created_at,
    };

    const token = createToken(safeUser);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
}

async function me(req, res) {
  try {
    const user = await authModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Me error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch user.",
    });
  }
}

module.exports = {
  register,
  login,
  me,
};