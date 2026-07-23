import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cartActions } from '../../store/cartStore';

export default function ProductCardVertical({ produk }) {
  const [added, setAdded] = useState(false);
  const name = produk.nama_produk || 'Produk Tanpa Nama';
  const price = produk.harga || 0;
  const stock = produk.stok || 0;
  const berat = produk.berat || 0;
  const image = produk.foto_produk ? `http://localhost:5000/images/${produk.foto_produk}` : 'https://via.placeholder.com/150?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartActions.addToCart(produk, 1, produk.berat ? `${produk.berat} gr` : '1 kg');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link to={`/product/${produk.id_produk || 1}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow">
      <div className="absolute top-2 left-2 bg-emerald-300/90 backdrop-blur-sm text-emerald-900 text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
        FRESH
      </div>
      
      <div className="aspect-4/3 w-full bg-gray-50 p-2 flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-[13px] md:text-sm font-semibold text-gray-800 line-clamp-2 mb-0.5">{name}</h4>
        <p className="text-[10px] text-gray-500 mb-2">Tersedia: {stock} kg</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">
              Rp <br className="md:hidden"/> {price.toLocaleString('id-ID')}<span className="text-[10px] text-gray-500 font-normal"> / {berat} gr</span>
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 text-white shrink-0 ${
              added ? 'bg-emerald-600 scale-95' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-90 shadow-sm'
            }`}
          >
            {added ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
