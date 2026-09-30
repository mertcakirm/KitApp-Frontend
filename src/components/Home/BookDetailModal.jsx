// src/components/BookDetailModal.jsx
import React, { useEffect } from 'react';
import { X, BookOpen, Download, Calendar, Tag, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const BookDetailModal = ({ book, onClose, onDownload }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!book) return null;

  const coverUrl = book.coverImage?.startsWith('http') 
    ? book.coverImage 
    : `${API_BASE_URL}${book.coverImage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Pop-up Kartı */}
      <div className="relative bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in z-10 flex flex-col max-h-[90vh]">
        
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2B3B2E] hover:text-[#121A13] p-1.5 bg-[#FAF6F0] hover:bg-[#EADFCF] rounded-full border border-[#DCD5CB] transition-colors cursor-pointer z-20"
        >
          <X size={18} className="stroke-[2.5]" />
        </button>

        {/* İçerik Alanı */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-5">
          
          {/* Görsel ve Başlık Grubu */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            {/* Büyük Kitap Kapağı */}
            <div className="relative aspect-[3/4] w-28 sm:w-32 bg-[#FAF6F0] rounded-2xl border border-[#E3DFD8] flex items-center justify-center text-[#A06A42] shadow-inner shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-[#A06A42]/5" />
              {book.coverImage ? (
                <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen size={44} className="stroke-[1.5] opacity-80" />
              )}
            </div>

            {/* Metinsel Bilgiler */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-black text-[#121A13] leading-tight break-words">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#A06A42] flex items-center justify-center sm:justify-start gap-1">
                  <User size={13} className="stroke-[2.5] inline" />
                  Yükleyen: {book.uploader?.username || "Bilinmiyor"}
                </p>
              </div>

              {/* Çoklu Kategoriler */}
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {book.categories?.map((category, index) => (
                  <span 
                    key={category.id || index} 
                    className="bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1"
                  >
                    <Tag size={9} className="stroke-[2.5]" />
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Kitap Açıklaması */}
          <div className="space-y-2 border-t-2 border-[#FAF6F0] pt-4.5">
            <h4 className="text-[10px] sm:text-xs font-black text-[#A06A42] uppercase tracking-wider">
              Kitap Açıklaması
            </h4>
            <div className="max-h-24 md:max-h-36 overflow-y-auto pr-1 bg-[#FAF6F0]/50 p-4 rounded-2xl border border-[#EADFCF]/50 scrollbar-thin scrollbar-thumb-[#A06A42]/20">
              <p className="text-xs sm:text-sm text-[#2B3B2E] font-medium leading-relaxed">
                {book.description || "Bu kitap hakkında henüz detaylı bir açıklama eklenmedi."}
              </p>
            </div>
          </div>

          {/* Bilgi Rozetleri */}
          <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs bg-[#FAF6F0]/30 p-3 rounded-2xl border border-[#DCD5CB]/50 shrink-0">
            <div className="flex items-center gap-2 text-[#2B3B2E] font-semibold">
              <Calendar size={13} className="text-[#A06A42]" />
              <span>Eklenme: <strong className="text-[#121A13]">{new Date(book.createdAt).toLocaleDateString('tr-TR')}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#2B3B2E] font-semibold">
              <BookOpen size={13} className="text-[#A06A42]" />
              <span>Durum: <strong className="text-[#121A13]">{book.isActive ? 'Aktif' : 'Pasif'}</strong></span>
            </div>
          </div>

        </div>

        {/* Alt Alan & İndirme Butonu */}
        <div className="border-t border-[#EADFCF] bg-[#FAF6F0]/50 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#EADFCF] border border-[#DCD5CB] text-[#2B3B2E] hover:text-[#121A13] font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          
          <button 
            type="button"
            onClick={() => {
              onDownload && onDownload(book);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-[#A06A42] hover:bg-[#85542E] active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Download size={14} className="stroke-[2.5]" />
            <span>PDF Dosyasını İndir</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookDetailModal;
