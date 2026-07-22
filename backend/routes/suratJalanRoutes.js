import express from 'express';
import { getSupir, simpanSuratJalan } from '../controllers/suratJalanController.js';

const router = express.Router();

router.get('/supir', getSupir);
router.post('/', simpanSuratJalan);

export default router;
