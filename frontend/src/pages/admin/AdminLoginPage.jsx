import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpeg';
import LoginForm from '../../features/auth/components/LoginForm';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        if (data.admin) {
          localStorage.setItem('adminUser', JSON.stringify(data.admin));
        }
        navigate('/admin');
      } else {
        setError(data.message || 'Email atau password salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Pane - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-emerald-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url('/src/assets/images/banner/sayuran.png')` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-emerald-900/90 via-emerald-900/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 pb-24 h-full w-full max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Mulai Perjalanan<br/>Segar Anda
          </h1>
          <p className="text-emerald-50 text-lg leading-relaxed max-w-lg font-medium opacity-90">
            Bergabunglah dengan ekosistem pertanian modern. Hubungkan hasil panen segar langsung ke pembeli dengan platform terpercaya kami.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Logo / Icon */}
          <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-8 border border-emerald-100 shadow-sm overflow-hidden">
            <img src={logoImage} alt="UdinFresh Logo" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 mb-6 font-medium">Masukkan email dan password Anda untuk masuk ke sistem.</p>

          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          
          <div className="mt-8 text-center text-xs text-gray-400">
            Kredensial Default: <span className="font-semibold text-emerald-600">admin@udinfresh.com</span> / <span className="font-semibold text-emerald-600">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
