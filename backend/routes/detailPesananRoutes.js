import express from 'express';
import { tambahDetailPesanan, ambilDetailOlehPesanan } from '../controllers/detailPesananController.js';

const router = express.Router();

router.post('/', tambahDetailPesanan);                
router.get('/:id_pesanan', ambilDetailOlehPesanan);  
export default router;