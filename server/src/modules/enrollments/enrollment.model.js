const db = require("../../config/db");

async function findEnrollment(userId, programId) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM enrollments
    WHERE user_id = ? AND program_id = ?
    LIMIT 1
    `,
    [userId, programId]
  );

  return rows[0] || null;
}

async function createEnrollment(userId, programId) {
  const [result] = await db.execute(
    `
    INSERT INTO enrollments (user_id, program_id, payment_status, progress_percent)
    VALUES (?, ?, 'paid', 0)
    `,
    [userId, programId]
  );

  return result.insertId;
}

async function getMyEnrollments(userId) {
  const [rows] = await db.execute(
    `
    SELECT
      e.id AS enrollment_id,
      e.payment_status,
      e.progress_percent,
      e.enrolled_at,
      p.id AS program_id,
      p.title,
      p.slug,
      p.description,
      p.domain,
      p.level,
      p.price,
      p.duration_days
    FROM enrollments e
    JOIN programs p ON p.id = e.program_id
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC
    `,
    [userId]
  );

  return rows;
}

module.exports = {
  findEnrollment,
  createEnrollment,
  getMyEnrollments,
};