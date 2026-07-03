import multer from 'multer';
import path from 'path';

// Mengatur lokasi penyimpanan dan nama file secara unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/'); // Foto disimpan di folder backend/public/images/
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik (contoh: 1718901234567-sayur.jpg) supaya tidak tabrakan
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Validasi jenis file (Hanya boleh Gambar: JPG, JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Hanya diperbolehkan JPG, JPEG, dan PNG.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Batasi ukuran maksimal foto (2 MB)
});

export default upload;