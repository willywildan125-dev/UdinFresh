import db from './config/db.js';
import bcrypt from 'bcryptjs';

const migrateAdmin = async () => {
  try {
    console.log("Checking admin table columns...");
    
    // Check if email column exists
    const [columns] = await db.query("SHOW COLUMNS FROM `admin` LIKE 'email'");
    if (columns.length === 0) {
      console.log("Adding 'email' and 'password' columns to admin table...");
      await db.query("ALTER TABLE `admin` ADD COLUMN `email` VARCHAR(255) NOT NULL UNIQUE AFTER `nama_admin`");
      await db.query("ALTER TABLE `admin` ADD COLUMN `password` VARCHAR(255) NOT NULL AFTER `email`");
      console.log("Columns added successfully!");
    } else {
      console.log("Columns already exist.");
    }

    // Check if there is an admin, if yes update the first one, else create new
    const [admins] = await db.query("SELECT * FROM `admin` LIMIT 1");
    
    const email = 'admin@udinfresh.com';
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (admins.length > 0) {
      console.log(`Updating existing admin (ID: ${admins[0].id_admin}) with default credentials...`);
      await db.query(
        "UPDATE `admin` SET `email` = ?, `password` = ? WHERE `id_admin` = ?", 
        [email, hashedPassword, admins[0].id_admin]
      );
      console.log("Admin updated successfully!");
    } else {
      console.log("Inserting new default admin...");
      await db.query(
        "INSERT INTO `admin` (`nama_admin`, `email`, `password`) VALUES (?, ?, ?)", 
        ['Super Admin', email, hashedPassword]
      );
      console.log("Default admin inserted successfully!");
    }

    console.log("Migration complete!");
    console.log("-----------------------------------------");
    console.log("Default Admin Login:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateAdmin();
