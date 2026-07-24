import React from 'react';

const CATEGORIES = [
  { name: 'Semua',   icon: '🛒', color: 'bg-gray-100 text-gray-700' },
  { name: 'Sayuran', icon: '🥬', color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Buah',    icon: '🍎', color: 'bg-red-50 text-red-700' },
  { name: 'Daging',  icon: '🥩', color: 'bg-orange-50 text-orange-700' },
  { name: 'Seafood', icon: '🐟', color: 'bg-blue-50 text-blue-700' },
  { name: 'Bumbu',   icon: '🧅', color: 'bg-yellow-50 text-yellow-700' },
];

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-all duration-150 ${
              isActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
