import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('1 kg');

  useEffect(() => {
    // Scroll to top when loaded
    window.scrollTo(0, 0);
    
    // Fetch product details
    fetch(`http://localhost:5000/api/produk/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((response) => {
        if (response.success) {
          setProduct(response.data);
        } else {
          // If the individual endpoint doesn't exist yet, we can fallback to fetching all and filtering
          return fetch('http://localhost:5000/api/produk')
            .then(res => res.json())
            .then(allRes => {
               const p = allRes.data.find(p => p.id_produk == id);
               if (p) setProduct(p);
            });
        }
      })
      .catch((err) => {
        console.error('Error fetching product, trying fallback:', err);
        // Fallback for missing backend endpoint
        fetch('http://localhost:5000/api/produk')
          .then(res => res.json())
          .then(allRes => {
             const p = allRes.data.find(p => p.id_produk == id);
             if (p) setProduct(p);
          })
          .catch(fallbackErr => console.error(fallbackErr));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    // In reality, might want to check against stock
    setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    cartActions.addToCart(product, quantity, selectedWeight);
    // Optional: show a small toast or visual feedback here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4 text-center">Produk tidak ditemukan atau telah dihapus.</p>
        <button onClick={handleBack} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Kembali</button>
      </div>
    );
  }

  const image = product.foto_produk ? `http://localhost:5000/images/${product.foto_produk}` : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'; // Fallback to a nice tomato image just in case
  const name = product.nama_produk || 'Produk Tanpa Nama';
  const price = product.harga || 0;
  
  // Mock data for things not in standard product schema
  const ulasan = 120;
  const rating = 4.9;
  const stockStatus = product.stok > 0 ? 'Tersedia' : 'Habis';
  
  const weights = ['1 kg', '2 kg', '5 kg', '10 kg'];

  return (
    <div className="min-h-screen bg-gray-50 md:py-6 flex justify-center">
      
      {/* Mobile-like container that centers on desktop */}
      <div className="w-full max-w-[500px] md:max-w-[800px] bg-white md:rounded-2xl md:shadow-lg overflow-hidden relative pb-24 md:pb-28">
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-40 bg-white px-4 py-3 flex items-center justify-between">
          <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Detail Produk
          </h1>
          <div className="w-7"></div>
        </header>

        {/* Product Image Slider */}
        <div className="relative aspect-square md:aspect-[16/9] w-full bg-gray-100 mt-12 md:mt-14">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
          </div>
        </div>

        {/* Product Details Section */}
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
            <span className="text-[11px] font-medium text-gray-500 ml-1">/ {product.berat ? `${product.berat} gr` : 'kg'}</span>
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center text-[11px] text-gray-500 mb-5 pb-5 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="mr-2">{rating} ({ulasan} ulasan)</span>
            <span className="text-gray-300 mx-1.5">•</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Stok: <span className="font-semibold text-gray-800">{stockStatus}</span></span>
          </div>

          {/* Pilih Berat */}
          <div className="mb-6">
            <h3 className="text-[13px] font-bold text-gray-900 mb-2.5">Pilih Berat</h3>
            <div className="flex flex-wrap gap-2">
              {weights.map(w => (
                <button 
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border ${
                    selectedWeight === w 
                      ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
            <p className="text-[11px] text-gray-500 leading-relaxed mb-1.5">
              {product.deskripsi || `${name} pilihan, dipanen langsung dari petani lokal. Memiliki daging buah yang tebal, sedikit biji, dan rasa yang manis segar. Cocok untuk salad, sandwich, atau diolah menjadi saus premium.`}
            </p>
            <button className="text-emerald-600 text-[10px] font-bold flex items-center hover:text-emerald-700">
              Baca Selengkapnya
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
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
                <h4 className="font-bold text-gray-900 text-[12px] mb-0.5">Kebun Makmur Sejahtera</h4>
                <div className="flex items-center text-[10px] text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Bandung Raya
                </div>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-emerald-600 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition-colors">
              Kunjungi
            </button>
          </div>
          
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="absolute md:fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 md:p-4 z-50 md:flex md:justify-center">
          <div className="w-full md:max-w-[800px] flex items-center gap-2.5">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-lg shrink-0 h-10 bg-white">
              <button 
                onClick={handleDecrease}
                className="w-9 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-6 text-center font-bold text-gray-800 text-[13px]">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-9 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-r-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-emerald-600 text-emerald-600 font-bold text-[12px] h-10 rounded-lg flex items-center justify-center hover:bg-emerald-50 transition-colors"
            >
              + Keranjang
            </button>
            <button className="flex-1 bg-[#047857] text-white font-bold text-[12px] h-10 rounded-lg flex items-center justify-center hover:bg-emerald-800 transition-colors">
              Beli Sekarang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
