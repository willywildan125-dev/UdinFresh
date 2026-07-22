import mysql from 'mysql2/promise';

async function run() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_udinfresh'
  });

  try {
    console.log('Altering surat_jalan table...');
    await db.query('ALTER TABLE surat_jalan ADD COLUMN id_pesanan int(11) NOT NULL');
    await db.query('ALTER TABLE surat_jalan ADD COLUMN id_supir int(11) NOT NULL');
    await db.query('ALTER TABLE surat_jalan ADD COLUMN no_surat_jalan varchar(50) NOT NULL');
    await db.query('ALTER TABLE surat_jalan ADD COLUMN tanggal_dibuat datetime DEFAULT current_timestamp()');
    
    await db.query('ALTER TABLE surat_jalan ADD CONSTRAINT surat_jalan_pesanan_fk FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan)');
    await db.query('ALTER TABLE surat_jalan ADD CONSTRAINT surat_jalan_supir_fk FOREIGN KEY (id_supir) REFERENCES supir(id_supir)');
  } catch(e) {
    console.log('Alter table error (might already exist):', e.message);
  }

  try {
    console.log('Inserting supir data...');
    await db.query(`INSERT INTO supir (nama_supir, nopol) VALUES 
      ('Ahmad Supardi', NULL), 
      ('Budi Santoso', NULL), 
      ('Candra Wijaya', NULL), 
      ('Deni Kurniawan', NULL)`);
  } catch(e) {
    console.log('Insert supir error:', e.message);
  }

  console.log('DB Updated');
  await db.end();
}

run();
