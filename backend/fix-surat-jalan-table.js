import mysql from 'mysql2/promise';

async function fixSuratJalanTable() {
  console.log('Connecting to database db_udinfresh to update `surat_jalan` table structure...');
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'db_udinfresh'
    });

    // Check existing columns of table surat_jalan
    const [columns] = await db.query('SHOW COLUMNS FROM surat_jalan');
    const existingCols = columns.map(c => c.Field);
    console.log('Existing columns in `surat_jalan`:', existingCols);

    if (!existingCols.includes('id_pesanan')) {
      console.log('Adding column `id_pesanan`...');
      await db.query('ALTER TABLE surat_jalan ADD COLUMN id_pesanan INT(11) NOT NULL');
    }

    if (!existingCols.includes('id_supir')) {
      console.log('Adding column `id_supir`...');
      await db.query('ALTER TABLE surat_jalan ADD COLUMN id_supir INT(11) NOT NULL');
    }

    if (!existingCols.includes('no_surat_jalan')) {
      console.log('Adding column `no_surat_jalan`...');
      await db.query('ALTER TABLE surat_jalan ADD COLUMN no_surat_jalan VARCHAR(50) NOT NULL');
    }

    if (!existingCols.includes('tanggal_dibuat')) {
      console.log('Adding column `tanggal_dibuat`...');
      await db.query('ALTER TABLE surat_jalan ADD COLUMN tanggal_dibuat DATETIME DEFAULT CURRENT_TIMESTAMP()');
    }

    // Check FKs or add FK constraints safely
    try {
      await db.query('ALTER TABLE surat_jalan ADD CONSTRAINT fk_sj_pesanan FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan)');
    } catch (e) {
      console.log('FK fk_sj_pesanan note:', e.message);
    }

    try {
      await db.query('ALTER TABLE surat_jalan ADD CONSTRAINT fk_sj_supir FOREIGN KEY (id_supir) REFERENCES supir(id_supir)');
    } catch (e) {
      console.log('FK fk_sj_supir note:', e.message);
    }

    const [updatedCols] = await db.query('SHOW COLUMNS FROM surat_jalan');
    console.log('\n--- Updated Columns in `surat_jalan` ---');
    console.table(updatedCols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null })));

    await db.end();
    console.log('Berhasil memperbarui struktur tabel `surat_jalan`!');
  } catch (err) {
    console.error('Gagal memperbarui tabel:', err.message);
  }
}

fixSuratJalanTable();
