import db from './config/db.js';

async function checkSupir() {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM supir;');
    console.log('Columns:');
    console.table(columns);

    const [drivers] = await db.query('SELECT * FROM supir;');
    console.log('Drivers:');
    console.table(drivers);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

checkSupir();
