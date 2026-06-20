import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pesananRoutes from './routes/pesananRoutes.js';
import produkRoutes from './routes/produkRoutes.js'
import detailPesananRoutes from './routes/detailPesananRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images')); 

// Hubungkan rute pesanan ke endpoint utama /api/pesanan
app.use('/api/pesanan', pesananRoutes);
app.use('/api/produk', produkRoutes)
app.use('/api/detail-pesanan', detailPesananRoutes);

// Jalur tes awal di browser
app.get('/', (req, res) => {
  res.json({ message: "Backend DINFRESH Berjalan Lancar!" });
});

app.listen(PORT, () => {
  console.log(`Server Dinfresh aktif di http://localhost:${PORT}`);
});