import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg'

const CATEGORIES = [
  { name: 'Semua Produk', icon: '🛒' },
  { name: 'Sayuran Segar', icon: '🥬' },
  { name: 'Buah-buahan', icon: '🍎' },
  { name: 'Bumbu Dapur', icon: '🧅' },
  { name: 'Kopi & Teh', icon: '☕' },
  { name: 'Organik Premium', icon: '⭐' },
];

export default function MainLayout() {
  // State untuk mengontrol buka/tutup sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 relative ">
      
      {/* ================= NAVBAR ================= */}
<nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">

    {/* Kiri */}
    <div className="flex items-center gap-3 shrink-0">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <Link
        to="/"
        className="text-2xl font-bold tracking-wider flex items-center"
      >
        <img
          src={logo}
          alt="UdinFresh Logo"
          className="h-10 w-38.5 rounded-lg shadow-sm"
        />
      </Link>
    </div>

    {/* Tengah */}
    <div className="hidden md:flex flex-1 justify-center">
      <input
        type="text"
        placeholder="Cari sayur, buah, atau bumbu dapur..."
        className="w-full max-w-xl h-10 px-5 rounded-lg text-gray-800 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
      />
    </div>

    {/* Kanan */}
    <div className="flex items-center gap-4 shrink-0 font-medium">
      <Link
        to="/"
        className="hidden sm:block text-gray-700 hover:text-emerald-600 transition"
      >
        Home
      </Link>

      <Link
        to="/cart"
        className="text-gray-700 hover:text-emerald-600 transition flex items-center gap-1"
      >
        Keranjang
        <span className="bg-emerald-700 text-xs px-2 py-0.5 rounded-full">
          0
        </span>
      </Link>

      <Link
        to="/login"
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm"
      >
        Masuk
      </Link>
    </div>

  </div>
</nav>

      {/* ================= SIDEBAR & OVERLAY ================= */}
      {/* 1. Backdrop Gelap (Hanya muncul saat sidebar buka) */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. Panel Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-100 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Sidebar */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍🌾</span>
            <div>
              <h2 className="font-bold text-emerald-900 text-lg">Menu Kategori</h2>
              <p className="text-xs text-emerald-600">Belanja Segar Hari Ini</p>
            </div>
          </div>
          {/* Tombol Tutup (X) */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-emerald-100 text-emerald-800 rounded-full transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List Menu Kategori */}
        <div className="p-4 grow overflow-y-auto space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                // Tambahkan aksi filter di sini nanti
                setIsSidebarOpen(false); // Otomatis tutup setelah pilih kategori
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all group cursor-pointer"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>
              <span className="grow">{category.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
          UdinFresh App v1.0
        </div>
      </aside>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="grow max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} UdinFresh. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
}