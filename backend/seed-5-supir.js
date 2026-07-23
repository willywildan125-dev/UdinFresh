import mysql from 'mysql2/promise';

async function seedSupir() {
  console.log('Connecting to MySQL database db_udinfresh...');
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'db_udinfresh',
    });

    console.log('Inserting vehicles into table `mobil`...');
    const vehicles = [
      ['B 1234 UDF', 'Box Carry'],
      ['D 5678 UDF', 'Pick Up L300'],
      ['B 9012 UDF', 'Blind Van GranMax'],
      ['D 3456 UDF', 'Box Engkel'],
      ['B 7890 UDF', 'Pick Up Carry'],
    ];

    for (const [nopol, type] of vehicles) {
      await db.query(
        'INSERT INTO mobil (nopol, type_mobil) VALUES (?, ?) ON DUPLICATE KEY UPDATE type_mobil = VALUES(type_mobil)',
        [nopol, type]
      );
    }

    console.log('Inserting 5 supir into table `supir`...');
    const drivers = [
      ['Ahmad Supardi', 'B 1234 UDF'],
      ['Budi Santoso', 'D 5678 UDF'],
      ['Candra Wijaya', 'B 9012 UDF'],
      ['Deni Kurniawan', 'D 3456 UDF'],
      ['Eko Prasetyo', 'B 7890 UDF'],
    ];

    for (const [nama, nopol] of drivers) {
      const [existing] = await db.query('SELECT * FROM supir WHERE nama_supir = ?', [nama]);
      if (existing.length === 0) {
        await db.query('INSERT INTO supir (nama_supir, nopol) VALUES (?, ?)', [nama, nopol]);
        console.log(`+ Ditambahkan: ${nama} (${nopol})`);
      } else {
        await db.query('UPDATE supir SET nopol = ? WHERE nama_supir = ?', [nopol, nama]);
        console.log(`= Diperbarui: ${nama} (${nopol})`);
      }
    }

    const [allSupir] = await db.query('SELECT * FROM supir');
    console.log('\n--- Daftar Supir Saat Ini di DB ---');
    console.table(allSupir);

    await db.end();
    console.log('Seeding supir berhasil diselesaikan!');
  } catch (err) {
    console.error('Gagal seeding supir:', err.message);
  }
}

seedSupir();
