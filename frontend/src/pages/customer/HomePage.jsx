import ProductCard from '../../features/products/components/ProductCard';

// Data produk bohongan (Mock Data) berdasarkan PDF UdinFresh
const MOCK_PRODUCTS = [
  { id: 1, name: 'Tomat Beef Segar', price: 24000, unit: 'kg', rating: 4.9, reviews: 120, icon: '🍅' },
  { id: 2, name: 'Robusta Coffee Beans', price: 45000, unit: 'kg', rating: 5.0, reviews: 85, icon: '☕' },
  { id: 3, name: 'Wortel Manis Organik', price: 15000, unit: 'kg', rating: 4.8, reviews: 230, icon: '🥕' },
  { id: 4, name: 'Bayam Hijau Hidroponik', price: 6000, unit: 'ikat', rating: 4.7, reviews: 310, icon: '🥬' },
  { id: 5, name: 'Bawang Merah Brebes', price: 35000, unit: 'kg', rating: 4.9, reviews: 145, icon: '🧅' },
  { id: 6, name: 'Kentang Dieng Super', price: 20000, unit: 'kg', rating: 4.8, reviews: 90, icon: '🥔' },
  { id: 7, name: 'Cabai Merah Keriting', price: 55000, unit: 'kg', rating: 4.6, reviews: 420, icon: '🌶️' },
  { id: 8, name: 'Brokoli Segar', price: 18000, unit: 'bonggol', rating: 4.9, reviews: 75, icon: '🥦' },
];

const CATEGORIES = ['Semua', 'Sayuran', 'Buah-buahan', 'Bumbu Dapur', 'Kopi & Teh', 'Organik'];

export default function HomePage() {
  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. HERO SECTION (Banner Utama) */}
      <section className="bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-100">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-emerald-900 mb-4 leading-tight">
            Hasil Bumi Segar Langsung ke Depan Pintu Anda
          </h1>
          <p className="text-emerald-700 mb-8 text-lg">
            Panen hari ini, dimasak hari ini. Nikmati sayur, buah, dan kebutuhan dapur berkualitas tinggi dari petani lokal UdinFresh.
          </p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Mulai Belanja 🛒
          </button>
        </div>
        <div className="text-9xl hidden md:block animate-bounce-slow">
          👨‍🌾
        </div>
      </section>

      {/* 2. KATEGORI FILTER */}
      <section>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat, index) => (
            <button 
              key={cat} 
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-semibold transition-colors border ${
                index === 0 
                  ? 'bg-emerald-600 text-white border-emerald-600' // Kategori "Semua" aktif
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. GRID PRODUK */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rekomendasi Hari Ini</h2>
          <a href="#" className="text-emerald-600 font-semibold hover:underline text-sm">Lihat Semua &rarr;</a>
        </div>
        
        {/* Grid Responsive: 2 kolom di HP, 3 kolom di Tablet, 4 kolom di PC */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}