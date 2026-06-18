const db = require("../../config/db");

async function getAllPrograms() {
  const [rows] = await db.execute(
    `
    SELECT 
      id,
      title,
      slug,
      description,
      domain,
      level,
      price,
      duration_days,
      thumbnail_url,
      is_active,
      created_at
    FROM programs
    WHERE is_active = TRUE
    ORDER BY id DESC
    `
  );

  return rows;
}

async function getProgramById(id) {
  const [rows] = await db.execute(
    `
    SELECT 
      id,
      title,
      slug,
      description,
      domain,
      level,
      price,
      duration_days,
      thumbnail_url,
      is_active,
      created_at
    FROM programs
    WHERE id = ? AND is_active = TRUE
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

async function createProgram({
  title,
  slug,
  description,
  domain,
  level,
  price,
  duration_days,
  thumbnail_url,
}) {
  const [result] = await db.execute(
    `
    INSERT INTO programs 
    (title, slug, description, domain, level, price, duration_days, thumbnail_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      slug,
      description || null,
      domain || null,
      level || null,
      price || 0,
      duration_days || 30,
      thumbnail_url || null,
    ]
  );

  return getProgramById(result.insertId);
}

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
};