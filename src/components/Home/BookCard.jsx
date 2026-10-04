// src/components/Home/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../common/Icon';
import { FILEBASE_URL } from '../../api/api';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      delay: index * 0.05,
    },
  }),
  hover: {
    y: -6,
    transition: { type: 'spring', stiffness: 350, damping: 22 },
  },
};

const imageVariants = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  hover: {
    scale: 1.07,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const floatingBadgeVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  visible: { opacity: 0, scale: 0.6, y: 8 },
  hover: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
};

const shineVariants = {
  hidden: { x: '-150%', skewX: -20 },
  visible: { x: '-150%', skewX: -20 },
  hover: {
    x: '200%',
    skewX: -20,
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
};

// Kapak URL'sini güvenli şekilde oluşturan yardımcı fonksiyon
const resolveCoverUrl = (rawPath) => {
  if (!rawPath) return null;
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  let cleanPath = rawPath.replace(/\\/g, '/');
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  if (!cleanPath.startsWith('/uploads/')) {
    cleanPath = cleanPath.startsWith('/covers/')
      ? `/uploads${cleanPath}`
      : `/uploads/covers${cleanPath}`;
  }

  return `${FILEBASE_URL}${cleanPath}`;
};

const BookCard = ({ book, index = 0, onDownload, onDetailClick }) => {
  const [imgError, setImgError] = useState(false);

  // Backend'den gelebilecek olası tüm isimlendirmeleri yakala
  const rawCover = book?.coverImage || book?.coverUrl || book?.cover_image || book?.cover;
  const coverUrl = resolveCoverUrl(rawCover);

  // Kitap veya yükleyen kullanıcı onaylı mı kontrolü
  const isVerified = Boolean(book?.isVerified || book?.is_verified || book?.uploader?.isVerified);

  // Kitap verisi değişirse hata durumunu sıfırla
  useEffect(() => {
    setImgError(false);
  }, [rawCover]);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex flex-col bg-[#FFFDFB] border-2 border-[#EADFCF] p-3 rounded-2xl hover:shadow-xl hover:shadow-[#A06A42]/10 hover:border-[#A06A42]/50 transition-colors duration-300 group h-full"
    >
      {/* Kitap Kapak Alanı */}
      <div
        onClick={() => onDetailClick && onDetailClick(book)}
        className="relative aspect-[3/4] w-full bg-[#FAF6F0] rounded-xl border border-[#E3DFD8] flex items-center justify-center text-[#A06A42] shadow-inner mb-3 overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-[#A06A42]/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />

        {/* Hover anında kapak üzerinden geçen ışık parlaması */}
        <motion.div
          variants={shineVariants}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent z-20 pointer-events-none"
        />

        {/* ÇOKLU KATEGORİ BADGE ALANI (Sol Üst) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[75%] z-20">
          {book.categories?.slice(0, 2).map((category, idx) => (
            <span
              key={category.id || idx}
              className="bg-[#FAF8F5]/90 border border-[#A06A42]/20 text-[#A06A42] text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs shrink-0 select-none backdrop-blur-xs"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* ONAYLI (VERIFIED) ROZETİ (Sağ Üst) */}
        {isVerified && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.15, rotate: 8 }}
            title="Onaylanmış İçerik"
            className="absolute top-2.5 right-2.5 bg-[#FAF8F5]/95 border border-[#2E7D32]/25 text-[#2E7D32] p-1 rounded-full shadow-xs z-20 flex items-center justify-center backdrop-blur-xs"
          >
            <Icon name="badge-check" size={14} strokeWidth={2.2} />
          </motion.div>
        )}

        {/* Kitap Kapak Resmi veya Varsayılan İkon */}
        {coverUrl && !imgError ? (
          <motion.img
            variants={imageVariants}
            src={coverUrl}
            alt={book.title}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            onError={() => {
              console.error('Kapak resmi yüklenemedi. Denenen URL:', coverUrl);
              setImgError(true);
            }}
          />
        ) : (
          <motion.div
            variants={{
              hidden: { scale: 1, rotate: 0 },
              visible: { scale: 1, rotate: 0 },
              hover: { scale: 1.12, rotate: -4, transition: { type: 'spring', stiffness: 300 } },
            }}
          >
            <Icon name="bookOpen" size={42} strokeWidth={1.5} variant="primary" className="opacity-80" />
          </motion.div>
        )}

        {/* Kapak Üzeri Mini İndirme İkonu */}
        <motion.button
          type="button"
          variants={floatingBadgeVariants}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDownload && onDownload(book);
          }}
          title="Hızlı İndir"
          className="absolute bottom-2.5 right-2.5 bg-[#A06A42] hover:bg-[#85542E] text-white p-2 rounded-lg shadow-md z-20 cursor-pointer"
        >
          <Icon name="download" size={14} />
        </motion.button>
      </div>

      {/* Kitap Bilgileri */}
      <div className="flex-1 flex flex-col justify-between text-center px-1">
        <div className="space-y-1">
          <h4
            className="text-xs sm:text-sm font-black text-[#121A13] line-clamp-1 group-hover:text-[#A06A42] transition-colors duration-200"
            title={book.title}
          >
            {book.title}
          </h4>

          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-[#A06A42]">
            <span className="truncate">
              {book.uploader?.username || 'Yazar Belirtilmemiş'}
            </span>
            {isVerified && (
              <span title="Onaylı" className="inline-flex items-center text-[#2E7D32] shrink-0">
                <Icon name="badge-check" size={15} strokeWidth={3} />
              </span>
            )}
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2 mt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.07, rotate: -6 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={() => onDetailClick && onDetailClick(book)}
            title="Detayları Gör"
            className="p-2.5 bg-[#FAF6F0] hover:bg-[#EADFCF] text-[#3C4A3E] hover:text-[#121A13] border border-[#DCD5CB] rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Icon name="info" size={16} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={() => onDownload && onDownload(book)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#A06A42] hover:bg-[#85542E] text-white py-2.5 rounded-xl text-[11px] font-black transition-colors cursor-pointer shadow-xs hover:shadow-md"
          >
            <Icon name="download" size={12} />
            <span>PDF İndir</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
