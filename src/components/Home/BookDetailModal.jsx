// src/components/Home/BookDetailModal.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';
import { FILEBASE_URL } from '../../api/api';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 26,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
};

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

const BookDetailModal = ({ book, onClose, onDownload }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!book) return;
    setImgError(false);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [book, onClose]);

  const rawCover = book?.coverImage || book?.coverUrl || book?.cover_image || book?.cover;
  const coverUrl = resolveCoverUrl(rawCover);

  const isVerified = Boolean(book?.isVerified);

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          key="book-detail-modal"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={onClose}
              title="Kapat (ESC)"
              className="absolute top-4 right-4 text-[#2B3B2E] hover:text-[#121A13] p-1.5 bg-[#FAF6F0] hover:bg-[#EADFCF] rounded-full border border-[#DCD5CB] transition-colors cursor-pointer z-20"
            >
              <Icon name="x" size={18} />
            </motion.button>

            {/* İçerik Alanı */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-5">
              {/* 1. Görsel ve Başlık Grubu */}
              <motion.div
                variants={sectionVariants}
                className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left"
              >
                {/* Büyük Kitap Kapağı */}
                <motion.div
                  whileHover={{ scale: 1.04, rotate: -1.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative aspect-[3/4] w-28 sm:w-32 bg-[#FAF6F0] rounded-2xl border border-[#E3DFD8] flex items-center justify-center text-[#A06A42] shadow-md shrink-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#A06A42]/5 pointer-events-none" />

                  {/* Kapak Üzeri Onaylı Rozeti */}
                  {isVerified && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      title="Onaylanmış İçerik"
                      className="absolute top-2 right-2 bg-[#FAF8F5]/95 border border-[#2E7D32]/25 text-[#2E7D32] p-1 rounded-full shadow-xs z-20 flex items-center justify-center backdrop-blur-xs"
                    >
                      <Icon name="badge-check" size={14} strokeWidth={2.2} />
                    </motion.div>
                  )}

                  {coverUrl && !imgError ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon name="bookOpen" size={44} strokeWidth={1.5} variant="primary" className="opacity-80" />
                  )}
                </motion.div>

                {/* Metinsel Bilgiler */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="space-y-1.5 pr-6 sm:pr-8">
                    <h3 className="text-lg md:text-xl font-black text-[#121A13] leading-tight break-words">
                      {book.title}
                    </h3>

                    {/* Yükleyen Bilgisi ve Onaylı İkonu */}
                    <div className="text-xs sm:text-sm font-bold text-[#A06A42] flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                      <Icon name="user" size={13} variant="primary" className="shrink-0" />
                      <span className="truncate">
                        Yükleyen: {book.uploader?.username || 'Bilinmiyor'}
                      </span>
                      {isVerified && (
                        <span
                          title="Onaylı İçerik / Kullanıcı"
                          className="inline-flex items-center gap-1 bg-[#2E7D32]/10 border border-[#2E7D32]/25 text-[#2E7D32] text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                        >
                          <Icon name="badge-check" size={12} strokeWidth={2.2} />
                          <span>Onaylı</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Çoklu Kategoriler */}
                  <motion.div
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                    className="flex flex-wrap gap-1.5 justify-center sm:justify-start"
                  >
                    {book.categories?.map((category, index) => (
                      <motion.span
                        key={category.id || index}
                        variants={tagVariants}
                        whileHover={{ scale: 1.06, y: -1 }}
                        className="bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 select-none"
                      >
                        <Icon name="tag" size={9} variant="primary" />
                        {category.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* 2. Kitap Açıklaması */}
              <motion.div
                variants={sectionVariants}
                className="space-y-2 border-t-2 border-[#FAF6F0] pt-4.5"
              >
                <h4 className="text-[10px] sm:text-xs font-black text-[#A06A42] uppercase tracking-wider">
                  Kitap Açıklaması
                </h4>
                <div className="max-h-24 md:max-h-36 overflow-y-auto pr-1 bg-[#FAF6F0]/50 p-4 rounded-2xl border border-[#EADFCF]/50 scrollbar-thin scrollbar-thumb-[#A06A42]/20">
                  <p className="text-xs sm:text-sm text-[#2B3B2E] font-medium leading-relaxed">
                    {book.description || 'Bu kitap hakkında henüz detaylı bir açıklama eklenmedi.'}
                  </p>
                </div>
              </motion.div>

              {/* 3. Bilgi Rozetleri */}
              <motion.div
                variants={sectionVariants}
                className="flex justify-between text-[11px] sm:text-xs bg-[#FAF6F0]/30 p-3 rounded-2xl border border-[#DCD5CB]/50 shrink-0"
              >
                <div className="flex items-center gap-2 text-[#2B3B2E]  font-semibold">
                  <Icon name="calendar" size={13} variant="primary" className="shrink-0" />
                  <span>
                    Eklenme :
                    <strong className="ml-1 text-[#121A13]">
                      {new Date(book.createdAt).toLocaleDateString('tr-TR')}
                    </strong>
                  </span>
                </div>
                <div className="flex ml-3 items-center gap-1.5 text-[#2B3B2E] font-semibold col-span-2 sm:col-span-1">
                  <Icon
                    name="badge-check"
                    size={14}
                    className={`shrink-0 ${isVerified ? 'text-[#2E7D32]' : 'text-[#A06A42]/60'}`}
                  />
                  <span>
                    Onay :
                    <strong className={isVerified ? 'text-[#2E7D32] ml-1' : 'ml-1 text-[#121A13]'}>
                      {isVerified ? 'Onaylandı' : 'Bekliyor'}
                    </strong>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* 4. Alt Alan & İndirme Butonu */}
            <motion.div
              variants={sectionVariants}
              className="border-t border-[#EADFCF] bg-[#FAF6F0]/50 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-[#EADFCF] border border-[#DCD5CB] text-[#2B3B2E] hover:text-[#121A13] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => {
                  onDownload && onDownload(book);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#A06A42] hover:bg-[#85542E] text-white py-2.5 px-4 rounded-xl text-xs font-black transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >
                <Icon name="download" size={14} />
                <span>PDF Dosyasını İndir</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookDetailModal;
