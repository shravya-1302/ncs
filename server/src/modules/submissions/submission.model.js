const db = require("../../config/db");

async function createSubmission({
  userId,
  programId,
  lessonId,
  githubLink,
  fileUrl,
}) {
  const [result] = await db.execute(
    `
    INSERT INTO task_submissions
    (user_id, program_id, lesson_id, github_link, file_url, status)
    VALUES (?, ?, ?, ?, ?, 'submitted')
    `,
    [userId, programId, lessonId || null, githubLink || null, fileUrl || null]
  );

  return result.insertId;
}

async function getMySubmissions(userId) {
  const [rows] = await db.execute(
    `
    SELECT 
      ts.id,
      ts.program_id,
      ts.lesson_id,
      ts.github_link,
      ts.file_url,
      ts.status,
      ts.feedback,
      ts.submitted_at,
      p.title AS program_title,
      l.title AS lesson_title
    FROM task_submissions ts
    JOIN programs p ON p.id = ts.program_id
    LEFT JOIN lessons l ON l.id = ts.lesson_id
    WHERE ts.user_id = ?
    ORDER BY ts.submitted_at DESC
    `,
    [userId]
  );

  return rows;
}

async function getSubmissionByLesson(userId, lessonId) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM task_submissions
    WHERE user_id = ? AND lesson_id = ?
    ORDER BY submitted_at DESC
    LIMIT 1
    `,
    [userId, lessonId]
  );

  return rows[0] || null;
}

async function getAllSubmissions() {
  const [rows] = await db.execute(
    `
    SELECT
      ts.id,
      ts.user_id,
      ts.program_id,
      ts.lesson_id,
      ts.github_link,
      ts.file_url,
      ts.status,
      ts.feedback,
      ts.submitted_at,
      u.name AS student_name,
      u.email AS student_email,
      p.title AS program_title,
      l.title AS lesson_title
    FROM task_submissions ts
    JOIN users u ON u.id = ts.user_id
    JOIN programs p ON p.id = ts.program_id
    LEFT JOIN lessons l ON l.id = ts.lesson_id
    ORDER BY ts.submitted_at DESC
    `
  );

  return rows;
}

async function reviewSubmission({ submissionId, status, feedback }) {
  await db.execute(
    `
    UPDATE task_submissions
    SET status = ?, feedback = ?
    WHERE id = ?
    `,
    [status, feedback || null, submissionId]
  );
}

module.exports = {
  createSubmission,
  getMySubmissions,
  getSubmissionByLesson,
  getAllSubmissions,
  reviewSubmission,
};