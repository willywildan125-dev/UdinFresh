import express from 'express';
import { buatPesanan, ambilSemuaPesanan } from '../controllers/pesananController.js';

const router = express.Router();

// Jalur endpoint URL
router.post('/', buatPesanan);      
router.get('/', ambilSemuaPesanan); 

export default router;