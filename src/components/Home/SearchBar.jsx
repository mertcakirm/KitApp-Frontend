// src/components/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onPopularClick }) => {
  const popularCategories = ['Dünya Klasikleri', 'Tarih', 'Bilim Kurgu', 'Edebiyat'];

  return (
    <div className="w-full max-w-2xl px-2 sm:px-4 shrink-0 mb-12">
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#1E2A20] transition-colors group-focus-within:text-[#A06A42]">
          <Search size={22} className="stroke-[2.5]" />
        </span>
        <input
          type="text"
          placeholder="Kitap adı, yazar veya kategori ara..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#FFFDFB] border-2 border-[#DCD5CB] rounded-2xl md:rounded-3xl py-4.5 md:py-5 pl-14 pr-6 text-base text-[#121A13] font-semibold placeholder-[#2B3B2E]/60 focus:outline-none focus:border-[#A06A42] focus:bg-white focus:ring-4 focus:ring-[#A06A42]/5 shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300"
        />
      </div>

      {/* HIZLI ARAMA ETİKETLERİ */}
      {!value && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="font-bold text-[#2B3B2E]">Popüler Kategoriler:</span>
          {popularCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onPopularClick(cat)}
              className="bg-[#A06A42]/5 hover:bg-[#A06A42] text-[#A06A42] hover:text-white border border-[#A06A42]/30 px-3 py-1 rounded-full font-bold cursor-pointer transition-all duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
