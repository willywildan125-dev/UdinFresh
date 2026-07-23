import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCardVertical from '../../components/ui/ProductCardVertical';

const CATEGORIES = [
  { name: 'Semua',   icon: '🛒', color: 'bg-gray-100 text-gray-700' },
  { name: 'Sayuran', icon: '🥬', color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Buah',    icon: '🍎', color: 'bg-red-50 text-red-700' },
  { name: 'Daging',  icon: '🥩', color: 'bg-orange-50 text-orange-700' },
  { name: 'Seafood', icon: '🐟', color: 'bg-blue-50 text-blue-700' },
  { name: 'Bumbu',   icon: '🧅', color: 'bg-yellow-50 text-yellow-700' },
];

export default function KategoriPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeCategory = searchParams.get('cat') || 'Semua';

  useEffect(() => {
    fetch('http://localhost:5000/api/produk')
      .then((r) => r.json())
      .then((res) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === 'Semua' ||
        (p.kategori && p.kategori.trim().toLowerCase() === activeCategory.trim().toLowerCase());
      const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  const setCategory = (name) => {
    if (name === 'Semua') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', name);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900">Kategori</h1>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 relative">
          <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {/* Count */}
        <p className="text-xs text-gray-400 mb-3 font-medium">
          {loading ? 'Memuat...' : `${filtered.length} produk ditemukan`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse p-3">
                <div className="aspect-4/3 bg-gray-100 rounded-xl mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-base font-bold text-gray-700 mb-1">Produk tidak ditemukan</h3>
            <p className="text-sm text-gray-400">Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filtered.map((p) => (
              <ProductCardVertical key={p.id_produk} produk={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
