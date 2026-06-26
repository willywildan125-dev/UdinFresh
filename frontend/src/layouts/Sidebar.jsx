import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Beranda', path: '/', icon: '🏠' },
    { name: 'Sayur', path: '/kategori/sayur', icon: '🥬' },
    { name: 'Buah', path: '/kategori/buah', icon: '🍎' },
    { name: 'Daging', path: '/kategori/daging', icon: '🥩' },
    { name: 'Ikan & Seafood', path: '/kategori/ikan', icon: '🐟' },
    { name: 'Bibit', path: '/kategori/bibit', icon: '🌱' },
    { name: 'Bumbu & Rempah', path: '/kategori/bumbu', icon: '🧅' },
    { name: 'Minuman', path: '/kategori/minuman', icon: '🧃' },
    { name: 'Semua Kategori', path: '/kategori', icon: '📋' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 hidden md:flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 w-full">
          <img src={logo} alt="UdinFresh" className="h-8 rounded-lg object-contain" />
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide pb-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
              }`}
            >
              <span className={`text-lg ${isActive ? 'grayscale-0' : 'grayscale'}`}>{item.icon}</span>
              {item.name}
              {isActive && (
                <div className="ml-auto w-1 h-5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Promo Banner */}
      <div className="p-4 mt-auto shrink-0 border-t border-gray-50">
        <div className="bg-emerald-600 rounded-xl p-4 text-center text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h4 className="font-bold text-lg mb-1">Gratis Ongkir</h4>
          <p className="text-[10px] text-emerald-100 mb-3 opacity-90">Min. belanja Rp50.000</p>
          <button className="w-full bg-white text-emerald-600 text-xs font-bold py-2 rounded-lg hover:bg-emerald-50 transition-colors">
            Belanja Sekarang
          </button>
        </div>
      </div>
    </aside>
  );
}
