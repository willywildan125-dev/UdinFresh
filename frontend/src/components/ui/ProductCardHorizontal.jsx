export default function ProductCardHorizontal({ produk }) {
  const name = produk.nama_produk || 'Produk';
  const price = produk.harga || 0;
  const berat = produk.berat || 0;
  const image = produk.foto_produk ? `http://localhost:5000/images/${produk.foto_produk}` : 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-3 flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow group">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      
      <div className="flex-1 min-w-0 py-1">
        <h4 className="text-[13px] md:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{name}</h4>
        <p className="text-[11px] md:text-xs font-bold text-emerald-600">
          Rp {price.toLocaleString('id-ID')} <span className="text-[10px] text-gray-500 font-normal">/ {berat} gr</span>
        </p>
      </div>

      <button className="w-8 h-8 rounded-full border border-gray-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors shrink-0 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m-2-2h4" />
        </svg>
      </button>
    </div>
  );
}
