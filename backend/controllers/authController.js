import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Add JWT_SECRET to your .env in the future. For now, fallback to a default
const JWT_SECRET = process.env.JWT_SECRET || 'udinfresh_super_secret_key_2026';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists by email
    const [admins] = await db.query('SELECT * FROM `admin` WHERE `email` = ?', [email]);
    
    if (admins.length === 0) {
      return res.status(401).json({ success: false, message: 'Email tidak ditemukan.' });
    }

    const admin = admins[0];

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: admin.id_admin, nama: admin.nama_admin, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      token,
      admin: {
        id: admin.id_admin,
        nama: admin.nama_admin,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error in adminLogin:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

export const createAdmin = async (req, res) => {
  const { nama, email, password } = req.body;

  try {
    // Check if email is already used
    const [existing] = await db.query('SELECT id_admin FROM `admin` WHERE `email` = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar untuk admin lain.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new admin
    const [result] = await db.query(
      'INSERT INTO `admin` (`nama_admin`, `email`, `password`) VALUES (?, ?, ?)',
      [nama, email, hashedPassword]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Admin baru berhasil ditambahkan.',
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Error in createAdmin:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan admin.' });
  }
};
