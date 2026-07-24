import React from 'react';
import ProductCardVertical from '../../../components/ui/ProductCardVertical';

export default function ProductList({ products, loading }) {
  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-base font-bold text-gray-700 mb-1">Produk tidak ditemukan</h3>
        <p className="text-sm text-gray-400">Coba kata kunci atau kategori lain</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCardVertical key={p.id_produk} produk={p} />
      ))}
    </div>
  );
}
