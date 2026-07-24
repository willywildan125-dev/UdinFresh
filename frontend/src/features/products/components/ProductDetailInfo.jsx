import React from 'react';

export default function ProductDetailInfo({
  product,
  rating = 4.9,
  ulasan = 120,
  stockStatus = '10 kg',
  weights = ['1 kg', '2 kg', '5 kg', '10 kg'],
  selectedWeight,
  setSelectedWeight,
  fullDescription,
  isDescExpanded,
  setIsDescExpanded,
  handleVisitStore
}) {
  const name = product?.nama_produk || 'Produk Tanpa Nama';
  const price = product?.harga || 0;

  return (
    <div className="px-5 pt-6 pb-6 bg-white rounded-t-3xl -mt-5 relative z-30">
      {/* Title & Badge */}
      <div className="flex justify-between items-start gap-4 mb-1">
        <h2 className="text-[19px] font-bold text-gray-900 leading-tight">
          {name}
        </h2>
        <div className="bg-emerald-100/60 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
          Segar
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <span className="text-[17px] font-bold text-emerald-600">Rp {price.toLocaleString('id-ID')}</span>
        <span className="text-[11px] font-medium text-gray-500 ml-1">/ {product?.berat ? `${product.berat} gr` : 'kg'}</span>
      </div>

      {/* Rating & Stock */}
      <div className="flex items-center text-[11px] text-gray-500 mb-5 pb-5 border-b border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400 fill-current mr-1" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="mr-2 font-semibold text-gray-700">{rating} <span className="font-normal text-gray-500">({ulasan} ulasan)</span></span>
        <span className="text-gray-300 mx-1.5">•</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span>Stok: <span className="font-semibold text-emerald-600">{stockStatus}</span></span>
      </div>

      {/* Pilih Berat */}
      <div className="mb-6">
        <h3 className="text-[13px] font-bold text-gray-900 mb-2.5">Pilih Berat</h3>
        <div className="flex flex-wrap gap-2">
          {weights.map(w => (
            <button 
              key={w}
              onClick={() => setSelectedWeight && setSelectedWeight(w)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                selectedWeight === w 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' 
                  : 'border-gray-200 text-gray-600 hover:border-emerald-300'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Deskripsi Produk */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-gray-900 mb-2">Deskripsi Produk</h3>
        <p className={`text-[11px] text-gray-500 leading-relaxed mb-1.5 transition-all ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
          {fullDescription}
        </p>
        <button 
          onClick={() => setIsDescExpanded && setIsDescExpanded(!isDescExpanded)}
          className="text-emerald-600 text-[10px] font-bold flex items-center hover:text-emerald-700 transition-colors"
        >
          {isDescExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-3 w-3 ml-0.5 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Toko Info */}
      <div className="bg-[#f8f9fa] border border-gray-100/80 rounded-xl p-3 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-emerald-600 text-sm">🏪</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-[12px] mb-0.5">{product?.nama_toko || 'Kebun Makmur Sejahtera'}</h4>
            <div className="flex items-center text-[10px] text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Bandung Raya
            </div>
          </div>
        </div>
        <button 
          onClick={handleVisitStore}
          className="px-3 py-1.5 border border-emerald-600 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-50 active:scale-95 transition-all"
        >
          Kunjungi
        </button>
      </div>
    </div>
  );
}
