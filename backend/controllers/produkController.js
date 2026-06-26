import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Menambah Produk Baru dengan Foto (Khusus Admin)
export const tambahProduk = async (req, res) => {
  const { nama_produk, harga, stok, berat, kategori } = req.body;
  const foto_produk = req.file ? req.file.filename : null;

  if (!nama_produk || !harga || !stok || !berat || !kategori) {
    return res.status(400).json({
      success: false,
      message: "Gagal! Semua form teks (nama, harga, stok, berat, kategori) wajib diisi."
    });
  }

  try {
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const hapusProduk = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT foto_produk FROM produk WHERE id_produk = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }

    const fotoLama = rows[0].foto_produk;

    const [result] = await db.query('DELETE FROM produk WHERE id_produk = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }

    if (fotoLama) {
      // __dirname = .../backend/controllers
      // jadi naik satu folder ke backend/, baru masuk public/images
      const filePath = path.join(__dirname, '..', 'public', 'images', fotoLama);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Gagal menghapus file foto:', filePath, '-', err.message);
        } else {
          console.log('File foto berhasil dihapus:', filePath);
        }
      });
    }

    return res.status(200).json({ success: true, message: "Produk berhasil dihapus!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mengubah/Edit Produk (Khusus Admin)
export const editProduk = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, stok, berat, kategori } = req.body;
  const foto_produk = req.file ? req.file.filename : null;

  if (!nama_produk || !harga || !stok || !berat || !kategori) {
    return res.status(400).json({ success: false, message: "Semua form teks wajib diisi." });
  }

  try {
    let query, params;
    if (foto_produk) {
      query = 'UPDATE produk SET nama_produk=?, harga=?, stok=?, berat=?, kategori=?, foto_produk=? WHERE id_produk=?'; // ✅ fix
      params = [nama_produk, harga, stok, berat, kategori, foto_produk, id];
    } else {
      query = 'UPDATE produk SET nama_produk=?, harga=?, stok=?, berat=?, kategori=? WHERE id_produk=?'; // ✅ fix
      params = [nama_produk, harga, stok, berat, kategori, id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Produk berhasil diperbarui!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};