import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpeg';

const API_URL = 'http://localhost:5000';

export default function SupirLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('supirToken') && localStorage.getItem('udinfresh_supir')) {
      navigate('/supir/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/supir/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('supirToken', data.token);
        localStorage.setItem('udinfresh_supir', JSON.stringify(data.data));
        navigate('/supir/dashboard');
      } else {
        setError(data.message || 'Email atau password salah.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Pane - Green hero */}
      <div className="hidden lg:flex w-1/2 relative bg-emerald-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url('/src/assets/images/banner/sayuran.png')` }}
        />
        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-700/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-teal-500/20 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-900/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
          {/* Logo top */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl border border-white/20 overflow-hidden flex items-center justify-center">
              <img src={logoImage} alt="UdinFresh" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">UdinFresh</span>
          </div>

          {/* Hero text */}
          <div className="pb-8">
            {/* Delivery icon */}
            <div className="w-20 h-20 bg-emerald-600/40 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Portal Kurir<br />
              <span className="text-emerald-300">UdinFresh</span>
            </h1>
            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-md font-medium">
              Kelola pengiriman, pantau rute, dan konfirmasi pesanan langsung dari satu platform terpadu.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-10">
              {[
                { label: 'Pengiriman/Hari', value: '50+' },
                { label: 'Rata-rata Rating', value: '4.9★' },
                { label: 'Supir Aktif', value: '11' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-emerald-300/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
              <img src={logoImage} alt="UdinFresh" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-gray-800 text-lg">UdinFresh</span>
          </div>

          {/* UdinFresh Logo badge */}
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 shadow-sm overflow-hidden">
            <img src={logoImage} alt="UdinFresh Logo" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Selamat Datang</h2>
          <p className="text-gray-500 mb-8 font-medium">Masuk ke Portal Supir UdinFresh untuk memulai tugas pengiriman Anda.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email Supir</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@udinfresh.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium tracking-wide bg-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white rounded-xl py-3.5 px-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] disabled:bg-emerald-400 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memuat...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-xs text-emerald-700 font-semibold mb-1">Cara Login Supir:</p>
            <p className="text-xs text-emerald-600">
              Gunakan nama depan sebagai email. Contoh:<br />
              <span className="font-bold">ahmad@udinfresh.com</span> / <span className="font-bold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
