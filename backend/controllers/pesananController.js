import db from '../config/db.js';

// FUNGSI 1: Membuat Pesanan Baru (Input dari Pembeli via Checkout)
// Menerima: nama_pembeli, no_hp, nama_toko, items (array), total_berat
export const buatPesanan = async (req, res) => {
  const { nama_pembeli, no_hp, nama_toko, items, total_berat } = req.body;

  // Validasi input wajib
  if (!nama_pembeli || !no_hp || !items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data pembeli dan item pesanan tidak boleh kosong."
    });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Cari pembeli berdasarkan no_hp, jika belum ada maka buat baru
    let id_pembeli;
    const [existing] = await connection.query(
      'SELECT id_pembeli FROM pembeli WHERE no_hp = ? LIMIT 1',
      [no_hp]
    );

    if (existing.length > 0) {
      id_pembeli = existing[0].id_pembeli;
      // Update nama dan toko jika ada perubahan
      await connection.query(
        'UPDATE pembeli SET nama_pembeli = ?, nama_toko = ? WHERE id_pembeli = ?',
        [nama_pembeli, nama_toko || '', id_pembeli]
      );
    } else {
      const [insertResult] = await connection.query(
        'INSERT INTO pembeli (nama_pembeli, no_hp, nama_toko) VALUES (?, ?, ?)',
        [nama_pembeli, no_hp, nama_toko || '']
      );
      id_pembeli = insertResult.insertId;
    }

    // Step 2: Buat pesanan baru
    const [pesananResult] = await connection.query(
      `INSERT INTO pesanan (tanggal_pesanan, status_pesanan, total_berat, id_pembeli) 
       VALUES (NOW(), 'Menunggu Pembayaran', ?, ?)`,
      [total_berat || 0, id_pembeli]
    );
    const id_pesanan = pesananResult.insertId;

    // Step 3: Masukkan item-item ke detail_pesanan
    const detailValues = items.map(item => [
      id_pesanan,
      item.id_produk,
      item.jumlah,
      item.subtotal
    ]);
    await connection.query(
      'INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, subtotal) VALUES ?',
      [detailValues]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      id_pesanan,
      id_pembeli
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// FUNGSI 2: Mengambil Semua Pesanan milik satu Pembeli (berdasarkan no_hp)
// Setiap pesanan sudah berisi array items dari detail_pesanan + nama produk
export const ambilPesananPerPembeli = async (req, res) => {
  const { no_hp } = req.params;

  try {
    // Cari id_pembeli dulu
    const [pembeli] = await db.query(
      'SELECT id_pembeli FROM pembeli WHERE no_hp = ? LIMIT 1',
      [no_hp]
    );

    if (pembeli.length === 0) {
      // Pembeli belum pernah pesan, kembalikan array kosong
      return res.status(200).json({ success: true, data: [] });
    }

    const id_pembeli = pembeli[0].id_pembeli;

    // Ambil semua pesanan beserta detail produknya dalam satu query
    const [rows] = await db.query(
      `SELECT 
         p.id_pesanan,
         p.tanggal_pesanan,
         p.status_pesanan,
         p.total_berat,
         dp.id_detail,
         dp.id_produk,
         dp.jumlah,
         dp.subtotal,
         pr.nama_produk,
         pr.harga,
         pr.berat,
         pr.foto_produk
       FROM pesanan p
       LEFT JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
       LEFT JOIN produk pr ON dp.id_produk = pr.id_produk
       WHERE p.id_pembeli = ?
       ORDER BY p.tanggal_pesanan DESC`,
      [id_pembeli]
    );

    // Grup rows menjadi array pesanan, masing-masing punya array items
    const pesananMap = new Map();
    for (const row of rows) {
      if (!pesananMap.has(row.id_pesanan)) {
        pesananMap.set(row.id_pesanan, {
          id_pesanan: row.id_pesanan,
          tanggal_pesanan: row.tanggal_pesanan,
          status_pesanan: row.status_pesanan,
          total_berat: row.total_berat,
          items: []
        });
      }
      if (row.id_detail) {
        pesananMap.get(row.id_pesanan).items.push({
          id_detail: row.id_detail,
          id_produk: row.id_produk,
          nama_produk: row.nama_produk,
          harga: row.harga,
          berat: row.berat,
          foto_produk: row.foto_produk,
          jumlah: row.jumlah,
          subtotal: row.subtotal
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: Array.from(pesananMap.values())
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FUNGSI 3: Mengambil Semua Pesanan (Untuk Tampilan Admin)
export const ambilSemuaPesanan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pesanan ORDER BY tanggal_pesanan DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FUNGSI 4: Membayar Pesanan (Simulasi Pembayaran oleh Customer)
export const bayarPesanan = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update status pesanan
    const [updateResult] = await connection.query(
      "UPDATE pesanan SET status_pesanan = 'Menunggu Konfirmasi' WHERE id_pesanan = ? AND status_pesanan = 'Menunggu Pembayaran'",
      [id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("Pesanan tidak ditemukan atau status tidak valid untuk pembayaran.");
    }

    // 2. Ambil total dari pesanan
    const [detailResult] = await connection.query(
      "SELECT SUM(subtotal) AS total_bayar FROM detail_pesanan WHERE id_pesanan = ?",
      [id]
    );
    const totalBayar = detailResult[0].total_bayar || 0;
    // Tambah ongkir manual misal 25000 jika dibutuhkan atau biarkan total_bayar sesuai item,
    // di frontend sudah ada ongkir. Tapi kita simpan total_bayar dari item saja dulu.

    // 3. Masukkan ke tabel pembayaran
    await connection.query(
      "INSERT INTO pembayaran (tanggal_bayar, total_bayar, id_pesanan) VALUES (NOW(), ?, ?)",
      [totalBayar, id]
    );

    await connection.commit();
    return res.status(200).json({ success: true, message: "Pembayaran berhasil. Menunggu konfirmasi admin." });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// FUNGSI 5: Mengonfirmasi Pesanan (Oleh Admin)
export const konfirmasiPesanan = async (req, res) => {
  const { id } = req.params;
  try {
    const [updateResult] = await db.query(
      "UPDATE pesanan SET status_pesanan = 'Diproses' WHERE id_pesanan = ? AND status_pesanan = 'Menunggu Konfirmasi'",
      [id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Pesanan tidak ditemukan atau status tidak valid untuk dikonfirmasi." });
    }

    return res.status(200).json({ success: true, message: "Pesanan berhasil dikonfirmasi dan sedang diproses." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};