import express from 'express';
import { adminLogin, createAdmin } from '../controllers/authController.js';

const router = express.Router();

// Route for admin login
router.post('/login', adminLogin);

// Route for creating a new admin (in a real app, this would be protected by a middleware to ensure only existing admins can create new ones)
router.post('/register', createAdmin);

export default router;
