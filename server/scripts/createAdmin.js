const bcrypt = require("bcryptjs");
const db = require("../src/config/db");

const ADMIN = {
  name: "NCS Admin",
  email: "admin@ncs.com",
  phone: "9999999999",
  password: "Admin@12345",
  role: "admin",
};

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash(ADMIN.password, 12);

    const [existing] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [ADMIN.email]
    );

    if (existing.length > 0) {
      await db.execute(
        `
        UPDATE users
        SET 
          name = ?,
          phone = ?,
          password_hash = ?,
          role = 'admin',
          is_verified = TRUE
        WHERE email = ?
        `,
        [ADMIN.name, ADMIN.phone, passwordHash, ADMIN.email]
      );

      console.log("Admin updated successfully.");
    } else {
      await db.execute(
        `
        INSERT INTO users 
        (name, email, phone, password_hash, role, is_verified)
        VALUES (?, ?, ?, ?, 'admin', TRUE)
        `,
        [ADMIN.name, ADMIN.email, ADMIN.phone, passwordHash]
      );

      console.log("Admin created successfully.");
    }

    console.log("Admin email:", ADMIN.email);
    console.log("Admin password:", ADMIN.password);

    process.exit(0);
  } catch (error) {
    console.error("Create admin error:", error);
    process.exit(1);
  }
}

createAdmin();