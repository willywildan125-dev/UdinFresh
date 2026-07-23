import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pesananRoutes from './routes/pesananRoutes.js';
import produkRoutes from './routes/produkRoutes.js'
import detailPesananRoutes from './routes/detailPesananRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import suratJalanRoutes from './routes/suratJalanRoutes.js';
import supirRoutes from './routes/supirRoutes.js';

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
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/surat-jalan', suratJalanRoutes);
app.use('/api/supir', supirRoutes);

// Jalur tes awal di browser
app.get('/', (req, res) => {
  res.json({ message: "Backend DINFRESH Berjalan Lancar!" });
});

// Middleware penanganan error global
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Ukuran file foto terlalu besar (Maksimal 2MB).' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server Dinfresh aktif di http://localhost:${PORT}`);
});