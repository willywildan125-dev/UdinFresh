import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CategoryFilter from '../../features/products/components/CategoryFilter';
import ProductList from '../../features/products/components/ProductList';

export default function KategoriPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const search = searchParams.get('search') || '';
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

        {/* Category chips — horizontal scroll component */}
        <CategoryFilter activeCategory={activeCategory} onSelectCategory={setCategory} />
      </div>

      {/* Results */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {/* Count */}
        <p className="text-xs text-gray-400 mb-3 font-medium">
          {loading ? 'Memuat...' : `${filtered.length} produk ditemukan`}
        </p>

        <ProductList products={filtered} loading={loading} />
      </div>
    </div>
  );
}
