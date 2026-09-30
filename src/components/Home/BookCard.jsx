// src/components/BookCard.jsx
import React from 'react';
import { BookOpen, Download, Info } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000'; // Backend sunucu adresiniz (coverImage ve pdf için)

const BookCard = ({ book, onDownload, onDetailClick }) => {
  // Görsel yolu mutlak değilse backend base URL ile birleştiriyoruz
  const coverUrl = book.coverImage?.startsWith('http') 
    ? book.coverImage 
    : `${API_BASE_URL}${book.coverImage}`;

  return (
    <div className="flex flex-col bg-[#FFFDFB] border-2 border-[#EADFCF] p-3 rounded-2xl hover:shadow-md hover:border-[#A06A42]/40 transition-all duration-200 group h-full">
      
      {/* Kitap Kapak Alanı */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF6F0] rounded-xl border border-[#E3DFD8] flex items-center justify-center text-[#A06A42] shadow-inner mb-3 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <div className="absolute inset-0 bg-[#A06A42]/5 group-hover:bg-transparent transition-colors" />
        
        {/* ÇOKLU KATEGORİ BADGE ALANI (Eski book.categories yerine, book.categories[x].name okuyoruz) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%] z-10">
          {book.categories?.slice(0, 2).map((category, index) => (
            <span 
              key={category.id || index} 
              className="bg-[#FAF8F5]/90 border border-[#A06A42]/20 text-[#A06A42] text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs shrink-0 select-none backdrop-blur-xs"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* Kitap Kapak Resmi */}
        {book.coverImage ? (
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Görsel yüklenemezse varsayılan kütüphane ikonu göster
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <BookOpen size={42} className="stroke-[1.5] opacity-80" />
        )}
        
        {/* Kapak Üzeri Mini İndirme İkonu */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#A06A42] text-white p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Download size={14} className="stroke-[2.5]" />
        </div>
      </div>

      {/* Kitap Bilgileri */}
      <div className="flex-1 flex flex-col justify-between text-center px-1">
        <div className="space-y-1">
          {/* Kitap Adı */}
          <h4 
            className="text-xs sm:text-sm font-black text-[#121A13] line-clamp-1 group-hover:text-[#A06A42] transition-colors" 
            title={book.title}
          >
            {book.title}
          </h4>
          
          {/* Yazar / Uploader (Gelen veride isterseniz uploader ismini basabilirsiniz) */}
          <p className="text-[10px] sm:text-xs font-bold text-[#A06A42] truncate">
            {book.uploader?.username || "Yazar Belirtilmemiş"}
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2 mt-4">
          {/* DETAY BUTONU */}
          <button 
            type="button"
            onClick={() => onDetailClick && onDetailClick(book)}
            title="Detayları Gör"
            className="p-2.5 bg-[#FAF6F0] hover:bg-[#EADFCF] text-[#3C4A3E] hover:text-[#121A13] border border-[#DCD5CB] rounded-xl transition-all cursor-pointer shrink-0"
          >
            <Info size={16} className="stroke-[2.5]" />
          </button>

          {/* PDF İNDİR BUTONU */}
          <button 
            type="button"
            onClick={() => onDownload && onDownload(book)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#A06A42] hover:bg-[#85542E] active:scale-[0.98] text-white py-2.5 rounded-xl text-[11px] font-black transition-all cursor-pointer"
          >
            <Download size={12} className="stroke-[2.5]" />
            <span>PDF İndir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
