export default function CategoryGrid() {
  const desktopCategories = [
    { name: 'Sayur', icon: '🥬' },
    { name: 'Buah', icon: '🍎' },
    { name: 'Daging', icon: '🥩' },
    { name: 'Bibit', icon: '🌱' },
    { name: 'Ikan & Seafood', icon: '🐟' },
    { name: 'Bumbu', icon: '🧅' },
    { name: 'Daging Olahan', icon: '🥫' },
    { name: 'Minuman', icon: '🧃' },
  ];

  const mobileCategories = [
    { name: 'Sayur', icon: '🥬' },
    { name: 'Buah', icon: '🍎' },
    { name: 'Daging', icon: '🥩' },
    { name: 'Semua', icon: '⚏' }, 
  ];

  return (
    <div className="px-4 md:px-6 mb-8">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-end mb-4">
        <h3 className="text-lg font-bold text-gray-900">Kategori</h3>
        <a href="#" className="text-emerald-600 text-sm font-semibold hover:underline">Lihat Semua</a>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {desktopCategories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600">
              {cat.icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-4 gap-2">
        {mobileCategories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gray-50 border border-gray-100 text-emerald-600">
              {cat.icon}
            </div>
            <span className="text-[11px] font-medium text-gray-800 text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
