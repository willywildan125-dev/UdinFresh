import mysql from 'mysql2/promise';

async function check() {
  try {
    const db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db_udinfresh'
    });
    
    const [columns] = await db.query("SHOW COLUMNS FROM produk");
    console.log("COLUMNS:", columns);
    
    const [rows] = await db.query("SELECT * FROM produk");
    console.log("ROWS:", rows);
    
    process.exit(0);
  } catch (err) {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  }
}

check();
