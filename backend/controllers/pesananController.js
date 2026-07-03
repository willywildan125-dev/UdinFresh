import db from '../config/db.js';

// FUNGSI 1: Membuat Pesanan Baru (Input dari Pembeli)
export const buatPesanan = async (req, res) => {
  const { id_pembeli, total_berat, id_admin } = req.body;

  // Validasi Aturan Bisnis: Minimal 10 kg
  if (total_berat < 10) {
    return res.status(400).json({
      success: false,
      message: "Gagal membuat pesanan. Volume pembelian minimal harus 10 Kg!"
    });
  }

  try {
    const query = `
      INSERT INTO pesanan (tanggal_pesanan, status_pesanan, total_berat, id_pembeli, id_admin) 
      VALUES (NOW(), 'Menunggu Konfirmasi', ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [total_berat, id_pembeli, id_admin || null]);

    return res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat secara sistem!",
      id_pesanan: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Mengambil Semua Pesanan (Untuk Tampilan Admin)
export const ambilSemuaPesanan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pesanan ORDER BY tanggal_pesanan DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};