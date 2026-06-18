require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function resetAdmin() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ncs",
  });

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await db.execute(
    `
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      password_hash = VALUES(password_hash),
      role = VALUES(role)
    `,
    ["NCS Admin", "admin@ncs.com", passwordHash, "admin"]
  );

  console.log("Admin ready:");
  console.log("Email: admin@ncs.com");
  console.log("Password: Admin@123");

  await db.end();
}

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});