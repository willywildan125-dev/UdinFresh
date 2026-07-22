import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpeg';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Gunakan login simulasi (langsung masuk)
    localStorage.setItem('adminToken', 'true');
    navigate('/admin');
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
        
        {/* Back Link optional, maybe not needed for admin */}
        {/* <a href="/" className="absolute top-8 left-8 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-2">
          &larr; Back to Home
        </a> */}

        <div className="w-full max-w-md">
          {/* Logo / Icon */}
          <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-8 border border-emerald-100 shadow-sm overflow-hidden">
            <img src={logoImage} alt="UdinFresh Logo" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 mb-6 font-medium">Enter your details to access your dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium tracking-wide"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-6 mb-6">
              <a href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              Masuk Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>

          </form>
          
        </div>
      </div>
    </div>
  );
}
