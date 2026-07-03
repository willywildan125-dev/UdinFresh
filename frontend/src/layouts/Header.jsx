import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 hidden md:block shadow-sm">
      <div className="flex items-center justify-between px-8 py-3 h-18 max-w-7xl mx-auto">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative transition-all duration-300 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm transition-all shadow-inner"
            placeholder="Cari sayur, buah, daging, dan lainnya..."
          />
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-5 ml-8">
          
          {/* Cart Button */}
          <Link to="/cart" className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-medium text-sm border border-emerald-100 hover:shadow-md hover:shadow-emerald-500/20 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart2 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            Keranjang
            <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full ml-1 font-bold shadow-sm">2</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <div className="w-9 h-9  rounded-full flex items-center justify-center overflow-hidden border border-emerald-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-gray-700 leading-none">User</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}