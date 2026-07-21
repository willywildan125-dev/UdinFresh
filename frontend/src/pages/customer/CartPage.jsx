import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/cartStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, storeGroups, totalItems, totalPrice, isAllSelected, actions } = useCart();

  const handleBack = () => {
    navigate(-1);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
          <button onClick={handleBack} className="p-1 -ml-1 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Keranjang</h1>
          <div className="w-8"></div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Keranjang kosong</h2>
          <p className="text-sm text-gray-500 mb-6">Yuk, mulai belanja dan penuhi keranjangmu dengan sayuran segar!</p>
          <button onClick={() => navigate('/')} className="bg-emerald-600 text-white font-bold py-2.5 px-8 rounded-full hover:bg-emerald-700 transition-colors">
            Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-32 flex justify-center">
      <div className="w-full max-w-[600px] md:max-w-[800px] bg-gray-50 relative">
        
        {/* Header */}
        <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-100 shadow-sm md:rounded-b-xl">
          <button onClick={handleBack} className="p-1 -ml-1 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Keranjang ({totalItems})
          </h1>
          <button className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors">
            Ubah
          </button>
        </header>

        {/* Cart Items List */}
        <div className="mt-2 md:mt-4 space-y-2 md:space-y-4 px-0 md:px-4">
          {storeGroups.map(group => (
            <div key={group.storeName} className="bg-white md:rounded-2xl border-y md:border border-gray-100 overflow-hidden">
              
              {/* Store Header */}
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    checked={group.isSelected}
                    onChange={(e) => actions.toggleStoreSelect(group.storeName, e.target.checked)}
                  />
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏪</span>
                  <span className="text-[13px] font-bold text-gray-900">{group.storeName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Products in Store */}
              <div className="px-4 py-1">
                {group.items.map((item, index) => (
                  <div key={item.cartItemId} className={`flex items-start gap-3 py-4 ${index !== group.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    {/* Checkbox */}
                    <label className="flex items-center cursor-pointer mt-5">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        checked={item.selected}
                        onChange={() => actions.toggleSelect(item.cartItemId)}
                      />
                    </label>

                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => actions.removeItem(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 p-0.5 transition-colors shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-1 flex items-center">
                          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                            {item.weight}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[15px] font-bold text-emerald-600">Rp {item.price.toLocaleString('id-ID')}</span>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-200 rounded-md h-7">
                          <button 
                            onClick={() => actions.updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-7 text-center text-[12px] font-semibold text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => actions.updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-r-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Safe area padding for bottom bar */}
        <div className="h-10"></div>
        
        {/* Bottom Bar Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 md:flex md:justify-center">
          <div className="w-full md:max-w-[800px] flex items-center justify-between">
            <label className="flex items-center cursor-pointer gap-2">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                checked={isAllSelected}
                onChange={(e) => actions.toggleSelectAll(e.target.checked)}
              />
              <span className="text-[13px] text-gray-600">Semua</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="text-right flex flex-col justify-center">
                <span className="text-[11px] text-gray-500 mb-0.5">Total Harga</span>
                <span className="text-[15px] font-bold text-emerald-600 leading-none">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                disabled={totalPrice === 0}
                onClick={() => totalPrice > 0 && navigate('/checkout')}
                className={`px-6 py-2.5 rounded-full text-[13px] font-bold shadow-sm transition-colors ${
                  totalPrice > 0 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Checkout ({cart.filter(i => i.selected).reduce((sum, i) => sum + i.quantity, 0)})
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}