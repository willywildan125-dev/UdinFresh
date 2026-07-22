import db from '../config/db.js';

export const getSupir = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM supir');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const simpanSuratJalan = async (req, res) => {
  const { id_pesanan, id_supir, no_surat_jalan } = req.body;
  const id_admin = 1; // Default admin ID for now
  
  if (!id_pesanan || !id_supir || !no_surat_jalan) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert ke tabel surat_jalan
    await connection.query(
      `INSERT INTO surat_jalan (id_admin, id_pesanan, id_supir, no_surat_jalan, tanggal_dibuat) 
       VALUES (?, ?, ?, ?, NOW())`,
      [id_admin, id_pesanan, id_supir, no_surat_jalan]
    );

    // 2. Update status pesanan jadi Sedang Dikirim
    await connection.query(
      `UPDATE pesanan SET status_pesanan = 'Sedang Dikirim' WHERE id_pesanan = ?`,
      [id_pesanan]
    );

    await connection.commit();
    return res.status(201).json({ success: true, message: "Surat jalan berhasil disimpan" });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
