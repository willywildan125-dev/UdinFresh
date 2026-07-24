import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'udinfresh_super_secret_key_2026';

// ─── Login Supir ────────────────────────────────────────────────────────────
export const loginSupir = async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = email || username;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  }
  if (!identifier.endsWith('@udinfresh.com')) {
    return res.status(401).json({ success: false, message: 'Gunakan email dengan domain @udinfresh.com' });
  }

  const namaDepan = identifier.split('@')[0].trim();

  try {
    const [drivers] = await db.query('SELECT * FROM supir WHERE nama_supir LIKE ? LIMIT 1', [`${namaDepan}%`]);
    if (drivers.length === 0) return res.status(401).json({ success: false, message: 'Supir tidak ditemukan.' });

    const supir = drivers[0];
    if (!supir.password) return res.status(401).json({ success: false, message: 'Password supir belum diatur. Silakan hubungi admin.' });

    const isMatch = await bcrypt.compare(password, supir.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Kata sandi salah.' });

    const token = jwt.sign(
      { id: supir.id_supir, nama: supir.nama_supir, role: 'supir' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true, message: 'Login berhasil.', token,
      data: { id_supir: supir.id_supir, nama_supir: supir.nama_supir, nopol: supir.nopol }
    });
  } catch (error) {
    console.error('Error in loginSupir:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// ─── Ambil Pesanan Aktif untuk Supir ────────────────────────────────────────
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
      WHERE sj.id_supir = ? AND p.status_pesanan IN ('Dikirim', 'Sedang Dikirim', 'Dalam Perjalanan', 'Paket Dibawa Kurir')
      ORDER BY p.tanggal_pesanan ASC
    `;
    const [rows] = await db.query(query, [id_supir]);

    for (let i = 0; i < rows.length; i++) {
      const pesanan = rows[i];
      const [items] = await db.query(`
        SELECT dp.jumlah, dp.subtotal, pr.nama_produk 
        FROM detail_pesanan dp
        JOIN produk pr ON dp.id_produk = pr.id_produk
        WHERE dp.id_pesanan = ?
      `, [pesanan.id_pesanan]);
      pesanan.items = items;
      pesanan.total_bayar = items.reduce((sum, item) => sum + item.subtotal, 0) + 25000;
    }

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Riwayat Pengiriman Supir (yang sudah Selesai / Gagal) ──────────────────
export const getRiwayatSupir = async (req, res) => {
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
      WHERE sj.id_supir = ? AND p.status_pesanan IN ('Selesai', 'Gagal Kirim')
      ORDER BY p.tanggal_pesanan DESC
      LIMIT 50
    `;
    const [rows] = await db.query(query, [id_supir]);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Status Pengiriman ────────────────────────────────────────────────
export const updateStatusPesanan = async (req, res) => {
  const { id_pesanan } = req.params;
  const { status } = req.body;

  const validStatuses = ['Paket Dibawa Kurir', 'Dalam Perjalanan', 'Selesai', 'Gagal Kirim'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid.' });
  }

  try {
    const [updateResult] = await db.query(
      'UPDATE pesanan SET status_pesanan = ? WHERE id_pesanan = ?',
      [status, id_pesanan]
    );
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, message: `Status pesanan diubah ke "${status}".` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Konfirmasi Selesai (legacy - tetap support) ─────────────────────────────
export const konfirmasiSelesai = async (req, res) => {
  const { id_pesanan } = req.params;
  try {
    const [updateResult] = await db.query(
      "UPDATE pesanan SET status_pesanan = 'Selesai' WHERE id_pesanan = ? AND status_pesanan IN ('Dikirim', 'Sedang Dikirim', 'Dalam Perjalanan', 'Paket Dibawa Kurir')",
      [id_pesanan]
    );
    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Pesanan tidak dapat diselesaikan.' });
    }
    return res.status(200).json({ success: true, message: 'Pesanan berhasil diselesaikan!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
