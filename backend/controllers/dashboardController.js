import db from '../config/db.js';

export const getDashboardData = async (req, res) => {
  try {
    // 1. Total Produk
    const [produkResult] = await db.query('SELECT COUNT(*) AS total FROM produk');
    const totalProduk = produkResult[0].total;

    // 2. Total Pesanan
    const [pesananResult] = await db.query('SELECT COUNT(*) AS total FROM pesanan');
    const totalPesanan = pesananResult[0].total;

    // 3. Pesanan Diproses (Menunggu Konfirmasi atau Diproses)
    const [diprosesResult] = await db.query("SELECT COUNT(*) AS total FROM pesanan WHERE status_pesanan != 'Selesai' AND status_pesanan != 'Dibatalkan'");
    const pesananDiproses = diprosesResult[0].total;

    // 4. Total Pendapatan (Sum dari detail_pesanan)
    const [pendapatanResult] = await db.query(`
      SELECT SUM(dp.subtotal) AS total 
      FROM detail_pesanan dp 
      JOIN pesanan p ON dp.id_pesanan = p.id_pesanan 
      WHERE p.status_pesanan = 'Selesai' OR p.status_pesanan != 'Dibatalkan'
    `);
    const totalPendapatan = pendapatanResult[0].total || 0;

    // 5. Recent Transactions
    const [recentTransactions] = await db.query(`
      SELECT 
        p.id_pesanan as id, 
        pem.nama_pembeli as customer, 
        p.status_pesanan as status, 
        (SELECT COALESCE(SUM(subtotal), 0) FROM detail_pesanan WHERE id_pesanan = p.id_pesanan) as amount 
      FROM pesanan p 
      LEFT JOIN pembeli pem ON p.id_pembeli = pem.id_pembeli 
      ORDER BY p.tanggal_pesanan DESC 
      LIMIT 5
    `);

    // 6. Category Data (Kategori Produk dan Jumlahnya)
    const [categoryResult] = await db.query(`
      SELECT kategori as name, COUNT(*) as val 
      FROM produk 
      GROUP BY kategori
    `);

    // Calculate percentage for categories
    const categories = categoryResult.map(c => ({
      name: c.name,
      val: Math.round((c.val / totalProduk) * 100) || 0
    }));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProduk,
          totalPesanan,
          pesananDiproses,
          totalPendapatan
        },
        recentTransactions: recentTransactions.map(tx => ({
          ...tx,
          id: `#ORD-${tx.id.toString().padStart(4, '0')}`,
          amount: `Rp ${tx.amount.toLocaleString('id-ID')}`
        })),
        categories
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
