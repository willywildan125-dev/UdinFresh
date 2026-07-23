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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

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
          // Fallback to fetching all products
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
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    const maxStock = product?.stok ?? 99;
    if (quantity < maxStock) {
      setQuantity(q => q + 1);
    } else {
      showToast(`Stok maksimal tercapai (${maxStock})`);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    cartActions.addToCart(product, quantity, selectedWeight);
    setAddedToCartSuccess(true);
    showToast(`🛒 ${quantity}x ${product.nama_produk} dimasukkan ke keranjang`);
    setTimeout(() => setAddedToCartSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    cartActions.addToCart(product, quantity, selectedWeight);
    navigate('/checkout');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(!isFavorite ? '❤️ Berhasil ditambahkan ke Favorit' : '💔 Dihapus dari Favorit');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.nama_produk || 'Produk UdinFresh',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Tautan produk disalin ke clipboard');
      } catch {
        showToast('Tautan: ' + window.location.href);
      }
    }
  };

  const handleVisitStore = () => {
    navigate('/kategori');
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

  const baseImage = product.foto_produk ? `http://localhost:5000/images/${product.foto_produk}` : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800';
  const name = product.nama_produk || 'Produk Tanpa Nama';
  const price = product.harga || 0;
  
  const ulasan = 120;
  const rating = 4.9;
  const stockStatus = (product.stok ?? 10) > 0 ? `${product.stok ?? 10} kg` : 'Habis';
  
  const weights = ['1 kg', '2 kg', '5 kg', '10 kg'];
  const gallery = [baseImage, baseImage, baseImage];

  const fullDescription = product.deskripsi || `${name} pilihan, dipanen langsung dari petani lokal. Memiliki kualitas unggul, kesegaran terjamin, dan tanpa bahan pengawet. Sangat cocok untuk kebutuhan memasak sehari-hari keluarga Anda. Diolah dan dikemas secara hiegenis untuk menjaga kebersihan dan kesegaran nutrisinya.`;

  return (
    <div className="min-h-screen bg-gray-50 md:py-6 flex justify-center">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Mobile-like container that centers on desktop */}
      <div className="w-full max-w-[500px] md:max-w-[800px] bg-white md:rounded-2xl md:shadow-lg overflow-hidden relative pb-24 md:pb-28">
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100/50">
          <button onClick={handleBack} aria-label="Kembali" className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-gray-900">
            Detail Produk
          </h1>
          <div className="flex items-center gap-1">
            <button onClick={handleToggleFavorite} aria-label="Favorit" className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={handleShare} aria-label="Bagikan" className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Product Image Slider */}
        <div className="relative aspect-square md:aspect-[16/9] w-full bg-gray-100 mt-12 md:mt-14">
          <img 
            src={gallery[activeImageIndex]} 
            alt={name} 
            className="w-full h-full object-cover transition-opacity duration-300" 
          />
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
            {gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  activeImageIndex === index ? 'w-5 bg-emerald-500' : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
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
                  onClick={() => setSelectedWeight(w)}
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
              onClick={() => setIsDescExpanded(!isDescExpanded)}
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
            <button 
              onClick={handleVisitStore}
              className="px-3 py-1.5 border border-emerald-600 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-50 active:scale-95 transition-all"
            >
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
                disabled={quantity <= 1}
                className="w-9 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-l-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-7 text-center font-bold text-gray-800 text-[13px]">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-9 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-r-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={handleAddToCart}
              className={`flex-1 font-bold text-[12px] h-10 rounded-lg flex items-center justify-center transition-all ${
                addedToCartSuccess 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-500'
                  : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-98'
              }`}
            >
              {addedToCartSuccess ? '✓ Ditambahkan' : '+ Keranjang'}
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-[#047857] text-white font-bold text-[12px] h-10 rounded-lg flex items-center justify-center hover:bg-emerald-800 active:scale-98 transition-all shadow-sm"
            >
              Beli Sekarang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
