import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cartStore';
import ProductDetailInfo from '../../features/products/components/ProductDetailInfo';

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
        <ProductDetailInfo
          product={product}
          rating={rating}
          ulasan={ulasan}
          stockStatus={stockStatus}
          weights={weights}
          selectedWeight={selectedWeight}
          setSelectedWeight={setSelectedWeight}
          fullDescription={fullDescription}
          isDescExpanded={isDescExpanded}
          setIsDescExpanded={setIsDescExpanded}
          handleVisitStore={handleVisitStore}
        />

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
