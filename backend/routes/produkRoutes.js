import express from 'express';
import { tambahProduk, ambilSemuaProduk } from '../controllers/produkController.js';
import upload from '../config/upload.js';

const router = express.Router();

// PASTIKAN upload.single ADA DI TENGAH SINI
router.post('/', upload.single('foto_produk'), tambahProduk); 
router.get('/', ambilSemuaProduk);

export default router;
