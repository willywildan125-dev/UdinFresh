import db from '../config/db.js';

//Menambah Produk Baru dengan Foto (Khusus Admin)
export const tambahProduk = async (req, res) => {
  const { nama_produk, harga, stok, berat, kategori } = req.body;
  
  // Ambil nama file foto yang sudah diproses oleh multer
  const foto_produk = req.file ? req.file.filename : null;

  // Validasi: Pastikan data teks wajib diisi
  if (!nama_produk || !harga || !stok || !berat || !kategori) {
    return res.status(400).json({ 
      success: false, 
      message: "Gagal! Semua form teks (nama, harga, stok, berat, kategori) wajib diisi." 
    });
  }

  try {
    // Jalankan query INSERT termasuk kolom foto_produk
    const query = `
      INSERT INTO produk (nama_produk, harga, stok, berat, kategori, foto_produk) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [nama_produk, harga, stok, berat, kategori, foto_produk]);

    return res.status(201).json({
      success: true,
      message: "Produk dengan foto berhasil ditambahkan ke etalase!",
      id_produk: result.insertId,
      nama_file_foto: foto_produk
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mengambil Semua Produk (Untuk Tampilan Katalog Pembeli)
export const ambilSemuaProduk = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produk ORDER BY id_produk DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};