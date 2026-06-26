import express from 'express';
import { tambahProduk, ambilSemuaProduk, hapusProduk, editProduk } from '../controllers/produkController.js';
import upload from '../config/upload.js';

const router = express.Router();

// PASTIKAN upload.single ADA DI TENGAH SINI
router.post('/', upload.single('foto_produk'), tambahProduk); 
router.get('/', ambilSemuaProduk);
router.put('/:id', upload.single('foto_produk'), editProduk);
router.delete('/:id', hapusProduk);

export default router;
