import express from 'express';
import { 
  loginSupir, 
  getPesananSupir, 
  konfirmasiSelesai 
} from '../controllers/supirController.js';

const router = express.Router();

router.post('/login', loginSupir);
router.get('/pesanan/:id_supir', getPesananSupir);
router.put('/pesanan/:id_pesanan/selesai', konfirmasiSelesai);

export default router;
