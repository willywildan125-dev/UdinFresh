import db from './config/db.js';
import bcrypt from 'bcryptjs';

const migrateSupir = async () => {
  try {
    console.log("Checking supir table columns...");
    
    // Check if password column exists
    const [columns] = await db.query("SHOW COLUMNS FROM `supir` LIKE 'password'");
    if (columns.length === 0) {
      console.log("Adding 'password' column to supir table...");
      await db.query("ALTER TABLE `supir` ADD COLUMN `password` VARCHAR(255) DEFAULT NULL AFTER `nopol`");
      console.log("Column 'password' added successfully!");
    } else {
      console.log("Column 'password' already exists.");
    }

    // Hash default password 'admin123'
    const defaultPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Get all drivers
    const [drivers] = await db.query("SELECT id_supir, nama_supir, password FROM `supir`");
    console.log(`Found ${drivers.length} drivers in database.`);

    for (const driver of drivers) {
      // If driver password is null or not hashed (doesn't start with $2a$ or $2b$), update it
      const hasHashedPassword = driver.password && (driver.password.startsWith('$2a$') || driver.password.startsWith('$2b$'));
      if (!hasHashedPassword) {
        console.log(`Hashing password for driver: ${driver.nama_supir} (ID: ${driver.id_supir})...`);
        await db.query(
          "UPDATE `supir` SET `password` = ? WHERE `id_supir` = ?", 
          [hashedPassword, driver.id_supir]
        );
      }
    }

    console.log("Migration complete!");
    console.log("-----------------------------------------");
    console.log("Default Driver Credentials:");
    console.log("Username: [Nama Supir, e.g. Ahmad Supardi]");
    console.log(`Password: ${defaultPassword}`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateSupir();
