import { Link } from 'react-router-dom';
// Import komponen UI yang baru saja kita buat
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk ke Akun Anda</h2>
      
      <form className="space-y-4">
        {/* Menggunakan komponen Input kita */}
        <Input 
          label="Email" 
          type="email" 
          id="email" 
          placeholder="nama@email.com" 
        />
        
        <Input 
          label="Kata Sandi" 
          type="password" 
          id="password" 
          placeholder="••••••••" 
        />
        
        <div className="flex items-center justify-between text-sm mt-2">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
            Ingat saya
          </label>
          <a href="#" className="text-emerald-600 font-semibold hover:underline">Lupa Kata Sandi?</a>
        </div>

        {/* Menggunakan komponen Button kita */}
        <Button variant="primary" className="w-full mt-4">
          Masuk
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Belum punya akun? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Daftar sekarang</Link>
      </p>
    </div>
  );
}