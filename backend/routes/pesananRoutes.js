import express from 'express';
import { buatPesanan, ambilSemuaPesanan, ambilPesananPerPembeli } from '../controllers/pesananController.js';

const router = express.Router();

router.post('/', buatPesanan);                        // Checkout → simpan ke DB
router.get('/', ambilSemuaPesanan);                   // Admin: semua pesanan
router.get('/pembeli/:no_hp', ambilPesananPerPembeli); // Customer: pesanan milik saya

export default router;