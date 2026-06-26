import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/customer/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/customer/CartPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🥬 Kelompok Halaman Pembeli (Menggunakan MainLayout ada Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      {/* 🔐 Kelompok Halaman Autentikasi (Menggunakan AuthLayout polos kotak di tengah) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}