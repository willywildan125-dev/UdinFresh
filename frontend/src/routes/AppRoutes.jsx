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
import AdminDataProdukPage from '../pages/admin/AdminDataProdukPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminSuratJalanPage from '../pages/admin/AdminSuratJalanPage';
import AdminLaporanPage from '../pages/admin/AdminLaporanPage';

import SupirLoginPage from '../pages/driver/SupirLoginPage';
import SupirDashboardPage from '../pages/driver/SupirDashboardPage';

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
        <Route path="laporan" element={<AdminLaporanPage />} />
        <Route path="users" element={
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Manajemen User</h1>
            <p className="text-sm text-gray-500">Fitur kelola pengguna admin & pembeli UdinFresh.</p>
          </div>
        } />
        <Route path="pengaturan" element={
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pengaturan Sistem</h1>
            <p className="text-sm text-gray-500">Konfigurasi alamat toko, metode pembayaran, dan toko UdinFresh.</p>
          </div>
        } />
        <Route path="*" element={<AdminDashboardPage />} />
      </Route>

      {/* 🚚 Kelompok Halaman Supir */}
      <Route path="/supir/login" element={<SupirLoginPage />} />
      <Route path="/supir/dashboard" element={<SupirDashboardPage />} />
    </Routes>
  );
}