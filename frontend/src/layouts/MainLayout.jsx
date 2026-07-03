import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-gray-50/30">
        {/* Desktop Header */}
        <Header />

        {/* Mobile Header */}
        <header className="md:hidden bg-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
          <button className="text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            Udin<span className="text-emerald-600">Fresh</span>
          </Link>
          <Link to="/cart" className="relative text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">2</span>
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0 relative">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}