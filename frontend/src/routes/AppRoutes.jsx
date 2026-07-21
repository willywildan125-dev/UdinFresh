import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

import HomePage from '../pages/customer/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminDataProdukPage from '../pages/admin/AdminDataProdukPage'; // We will create this
import AdminLoginPage from '../pages/admin/AdminLoginPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🥬 Kelompok Halaman Pembeli */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* 🔐 Kelompok Halaman Autentikasi */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 🛡️ Kelompok Halaman Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="produk" element={<AdminDataProdukPage />} />
        {/* Other routes can be added here later */}
      </Route>
    </Routes>
  );
}