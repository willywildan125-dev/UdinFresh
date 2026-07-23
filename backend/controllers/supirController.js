import db from '../config/db.js';

// Login Supir
// Username menggunakan email (namadepan@udinfresh.com) dan password 'admin123'
export const loginSupir = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  }

  if (password !== 'admin123') {
    return res.status(401).json({ success: false, message: 'Kata sandi salah.' });
  }

  // Extract nama depan dari email
  if (!username.endsWith('@udinfresh.com')) {
    return res.status(401).json({ success: false, message: 'Gunakan email dengan domain @udinfresh.com' });
  }

  const namaDepan = username.split('@')[0].trim();
  
  try {
    // Cari supir yang namanya berawalan "namaDepan"
    const [supir] = await db.query('SELECT * FROM supir WHERE nama_supir LIKE ? LIMIT 1', [`${namaDepan}%`]);

    if (supir.length === 0) {
      return res.status(401).json({ success: false, message: 'Supir tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: supir[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Ambil Pesanan untuk Supir
// Menampilkan pesanan yang di-assign ke supir ini (dari tabel surat_jalan) dan status pesanan belum 'Selesai'
export const getPesananSupir = async (req, res) => {
  const { id_supir } = req.params;

  try {
    const query = `
      SELECT 
        p.id_pesanan,
        p.tanggal_pesanan,
        p.status_pesanan,
        p.total_berat,
        pb.nama_pembeli,
        pb.no_hp as hp_pembeli,
        pb.nama_toko,
        sj.no_surat_jalan
      FROM pesanan p
      JOIN surat_jalan sj ON p.id_pesanan = sj.id_pesanan
      JOIN pembeli pb ON p.id_pembeli = pb.id_pembeli
      WHERE sj.id_supir = ? AND p.status_pesanan IN ('Dikirim', 'Sedang Dikirim')
      ORDER BY p.tanggal_pesanan ASC
    `;

    const [rows] = await db.query(query, [id_supir]);

    // Untuk setiap pesanan, ambil detail itemnya juga agar supir tahu apa yang diantar
    for (let i = 0; i < rows.length; i++) {
      const pesanan = rows[i];
      const [items] = await db.query(`
        SELECT dp.jumlah, dp.subtotal, pr.nama_produk 
        FROM detail_pesanan dp
        JOIN produk pr ON dp.id_produk = pr.id_produk
        WHERE dp.id_pesanan = ?
      `, [pesanan.id_pesanan]);
      pesanan.items = items;
      pesanan.total_bayar = items.reduce((sum, item) => sum + item.subtotal, 0) + 25000; // include ongkir
    }

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Supir konfirmasi pesanan selesai
export const konfirmasiSelesai = async (req, res) => {
  const { id_pesanan } = req.params;

  try {
    const [updateResult] = await db.query(
      "UPDATE pesanan SET status_pesanan = 'Selesai' WHERE id_pesanan = ? AND status_pesanan IN ('Dikirim', 'Sedang Dikirim')",
      [id_pesanan]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Pesanan tidak dapat diselesaikan. Mungkin statusnya sudah berubah atau pesanan tidak ditemukan." });
    }

    return res.status(200).json({ success: true, message: "Pesanan berhasil diselesaikan!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
