import express from 'express';
import { 
  buatPesanan, 
  ambilSemuaPesanan, 
  ambilPesananPerPembeli,
  bayarPesanan,
  konfirmasiPesanan
} from '../controllers/pesananController.js';

const router = express.Router();

router.post('/', buatPesanan);                        // Checkout → simpan ke DB
router.get('/', ambilSemuaPesanan);                   // Admin: semua pesanan
router.get('/pembeli/:no_hp', ambilPesananPerPembeli); // Customer: pesanan milik saya
router.put('/:id/bayar', bayarPesanan);               // Customer: bayar pesanan
router.put('/:id/konfirmasi', konfirmasiPesanan);     // Admin: konfirmasi pesanan

export default router;