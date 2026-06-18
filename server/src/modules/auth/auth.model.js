const db = require("../../config/db");

async function findUserByEmail(email) {
  const [rows] = await db.execute(
    `
    SELECT id, name, email, phone, password_hash, role, is_verified, created_at
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await db.execute(
    `
    SELECT id, name, email, phone, role, is_verified, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

async function createUser({ name, email, phone, passwordHash, role = "student" }) {
  const [result] = await db.execute(
    `
    INSERT INTO users (name, email, phone, password_hash, role, is_verified)
    VALUES (?, ?, ?, ?, ?, TRUE)
    `,
    [name, email, phone || null, passwordHash, role]
  );

  return findUserById(result.insertId);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};