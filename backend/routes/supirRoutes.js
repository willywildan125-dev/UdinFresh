import express from 'express';
import { 
  loginSupir, 
  getPesananSupir, 
  getRiwayatSupir,
  updateStatusPesanan,
  konfirmasiSelesai 
} from '../controllers/supirController.js';

const router = express.Router();

router.post('/login', loginSupir);
router.get('/pesanan/:id_supir', getPesananSupir);
router.get('/riwayat/:id_supir', getRiwayatSupir);
router.put('/pesanan/:id_pesanan/status', updateStatusPesanan);
router.put('/pesanan/:id_pesanan/selesai', konfirmasiSelesai);

export default router;
