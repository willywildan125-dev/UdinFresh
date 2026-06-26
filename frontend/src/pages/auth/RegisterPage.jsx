import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Daftar Akun Baru</h2>
      <p className="text-xs text-center text-gray-500 mb-4">Bergabunglah untuk mendapatkan hasil bumi terbaik.</p>
      <p className="text-xs text-gray-600 text-center mt-4">
        Sudah punya akun? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Masuk di sini</Link>
      </p>
    </div>
  );
}