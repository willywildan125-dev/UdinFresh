import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroBanner from '../../components/ui/HeroBanner';
import ProductCardVertical from '../../components/ui/ProductCardVertical';
import ProductCardHorizontal from '../../components/ui/ProductCardHorizontal';
import FeatureFooter from '../../components/ui/FeatureFooter';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'Semua';

  useEffect(() => {
    // Fetch products from backend
    fetch('http://localhost:5000/api/produk')
      .then(res => res.json())
      .then(response => {
        // data API: { success: true, data: rows }
        setProducts(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data produk", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Semua' || (p.kategori && p.kategori.trim().toLowerCase() === category.trim().toLowerCase());
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const handleMobileSearch = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto md:py-2">
      
      {/* Mobile Search Bar (Only visible on mobile) */}
      <div className="md:hidden px-4 mt-4 mb-4 relative">
        <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          defaultValue={search}
          onChange={handleMobileSearch}
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="Cari sayur, buah, daging..."
        />
      </div>

      <HeroBanner />

      {/* PRODUK TERBARU */}
      <div className="px-4 md:px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Produk Terbaru</h3>
          <a href="#semua-produk" className="text-emerald-600 text-xs md:text-sm font-semibold hover:underline">Lihat Semua</a>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Produk tidak ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCardVertical key={product.id_produk || Math.random()} produk={product} />
            ))}
          </div>
        )}
      </div>

      {/* SEMUA PRODUK (DITAMBAHKAN DI SINI) */}
      <div id="semua-produk" className="px-4 md:px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Semua Produk</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Produk tidak ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCardVertical key={`all-${product.id_produk || Math.random()}`} produk={product} />
            ))}
          </div>
        )}
      </div>

      {/* PRODUK POPULER */}
      <div className="px-4 md:px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Produk Populer</h3>
          <a href="#semua-produk" className="text-emerald-600 text-xs md:text-sm font-semibold hover:underline">Lihat Semua</a>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Produk tidak ditemukan</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Show slightly different set of products for variety if possible */}
            {filteredProducts.slice(0, 4).reverse().map((product) => (
              <ProductCardHorizontal key={`pop-${product.id_produk || Math.random()}`} produk={product} />
            ))}
          </div>
        )}
      </div>

      <FeatureFooter />
    </div>
  );
}