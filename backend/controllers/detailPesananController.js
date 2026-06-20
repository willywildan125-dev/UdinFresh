import db from '../config/db.js';

// FUNGSI: Memasukkan barang-barang yang dibeli ke detail pesanan
export const tambahDetailPesanan = async (req, res) => {
  const { id_pesanan, keranjang_belanja } = req.body;


  // Validasi: Pastikan data tidak kosong
  if (!id_pesanan || !keranjang_belanja || keranjang_belanja.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Gagal! Data pesanan atau item keranjang tidak boleh kosong."
    });
  }

  try {
    // Format yang dicari MySQL: [ [id_pesanan, id_produk, jumlah, subtotal], [id_pesanan, id_produk, ...] ]
    const values = keranjang_belanja.map(item => [
      id_pesanan,
      item.id_produk,
      item.jumlah,
      item.subtotal
    ]);

    // 2. Jalankan query Bulk Insert
    const query = `
      INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, subtotal) 
      VALUES ?
    `;
    
    await db.query(query, [values]);

    return res.status(201).json({
      success: true,
      message: "Item belanjaan berhasil dicatat ke detail pesanan!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FUNGSI: Mengambil item belanjaan berdasarkan ID Pesanan (Untuk dilihat Admin/Pembeli)
export const ambilDetailOlehPesanan = async (req, res) => {
  const { id_pesanan } = req.params;

  try {
    // Kita JOIN dengan tabel produk agar bisa memunculkan NAMA PRODUK-nya, bukan cuma ID-nya saja
    const query = `
      SELECT dp.*, p.nama_produk, p.harga 
      FROM detail_pesanan dp
      JOIN produk p ON dp.id_produk = p.id_produk
      WHERE dp.id_pesanan = ?
    `;
    
    const [rows] = await db.query(query, [id_pesanan]);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};