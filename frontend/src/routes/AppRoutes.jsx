import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

import HomePage from '../pages/customer/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import KategoriPage from '../pages/customer/KategoriPage';
import PesananPage from '../pages/customer/PesananPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminDataProdukPage from '../pages/admin/AdminDataProdukPage'; // We will create this
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminSuratJalanPage from '../pages/admin/AdminSuratJalanPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🥬 Kelompok Halaman Pembeli */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/kategori" element={<KategoriPage />} />
        <Route path="/pesanan" element={<PesananPage />} />
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
        <Route path="pesanan" element={<AdminOrdersPage />} />
        <Route path="surat-jalan" element={<AdminSuratJalanPage />} />
        {/* Other routes can be added here later */}
      </Route>
    </Routes>
  );
}