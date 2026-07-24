import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../features/auth/components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (credentials) => {
    setLoading(true);
    setError('');
    
    // Simulate customer login
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        localStorage.setItem('udinfresh_user_phone', '08123456789'); // mock phone number for order queries
        localStorage.setItem('udinfresh_user_email', credentials.email);
        navigate('/');
      } else {
        setError('Email atau password wajib diisi.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk ke Akun Anda</h2>
      
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

      <p className="text-sm text-gray-600 text-center mt-6">
        Belum punya akun? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Daftar sekarang</Link>
      </p>
    </div>
  );
}