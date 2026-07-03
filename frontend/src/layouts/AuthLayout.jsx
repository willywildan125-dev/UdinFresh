import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        {/* Header Identitas Aplikasi */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-emerald-600 tracking-wide">UdinFresh</h1>
          <p className="text-gray-500 text-xs mt-1">Hasil bumi segar langsung ke depan pintu Anda</p>
        </div>
        
        {/* Tempat Form Login / Register Muncul */}
        <Outlet />
      </div>
    </div>
  );
}