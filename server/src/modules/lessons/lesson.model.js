const db = require("../../config/db");

async function getProgramModulesWithLessons(programId, userId) {
  const [modules] = await db.execute(
    `
    SELECT id, program_id, title, sort_order
    FROM course_modules
    WHERE program_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [programId]
  );

  const [lessons] = await db.execute(
    `
    SELECT 
      l.id,
      l.module_id,
      l.title,
      l.video_url,
      l.notes_url,
      l.content,
      l.sort_order,
      CASE WHEN lp.id IS NULL THEN FALSE ELSE TRUE END AS is_completed
    FROM lessons l
    LEFT JOIN lesson_progress lp 
      ON lp.lesson_id = l.id AND lp.user_id = ?
    WHERE l.module_id IN (
      SELECT id FROM course_modules WHERE program_id = ?
    )
    ORDER BY l.sort_order ASC, l.id ASC
    `,
    [userId, programId]
  );

  return modules.map((module) => ({
    ...module,
    lessons: lessons.filter((lesson) => lesson.module_id === module.id),
  }));
}

async function getLessonById(lessonId) {
  const [rows] = await db.execute(
    `
    SELECT 
      l.id,
      l.module_id,
      l.title,
      l.video_url,
      l.notes_url,
      l.content,
      l.sort_order,
      cm.program_id,
      cm.title AS module_title,
      p.title AS program_title
    FROM lessons l
    JOIN course_modules cm ON cm.id = l.module_id
    JOIN programs p ON p.id = cm.program_id
    WHERE l.id = ?
    LIMIT 1
    `,
    [lessonId]
  );

  return rows[0] || null;
}

async function markLessonCompleted({ userId, lessonId, programId }) {
  await db.execute(
    `
    INSERT INTO lesson_progress (user_id, lesson_id, program_id, is_completed)
    VALUES (?, ?, ?, TRUE)
    ON DUPLICATE KEY UPDATE 
      is_completed = TRUE,
      completed_at = CURRENT_TIMESTAMP
    `,
    [userId, lessonId, programId]
  );
}

async function countProgramLessons(programId) {
  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM lessons l
    JOIN course_modules cm ON cm.id = l.module_id
    WHERE cm.program_id = ?
    `,
    [programId]
  );

  return rows[0]?.total || 0;
}

async function countCompletedLessons(userId, programId) {
  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS completed
    FROM lesson_progress
    WHERE user_id = ? AND program_id = ? AND is_completed = TRUE
    `,
    [userId, programId]
  );

  return rows[0]?.completed || 0;
}

async function updateEnrollmentProgress(userId, programId, progressPercent) {
  await db.execute(
    `
    UPDATE enrollments
    SET progress_percent = ?
    WHERE user_id = ? AND program_id = ?
    `,
    [progressPercent, userId, programId]
  );
}

module.exports = {
  getProgramModulesWithLessons,
  getLessonById,
  markLessonCompleted,
  countProgramLessons,
  countCompletedLessons,
  updateEnrollmentProgress,
};