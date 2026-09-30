// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';

// Popüler kategoriler kapsayıcısı için sıralı (stagger) animasyon varyantı
const categoriesContainerVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 16,
    transition: {
      height: { type: 'spring', stiffness: 300, damping: 28 },
      opacity: { duration: 0.25 },
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.25, ease: 'easeInOut' },
      opacity: { duration: 0.15 },
    },
  },
};

// Her bir kategori butonu için yaylanma varyantı
const categoryPillVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 20 },
  },
};

const SearchBar = ({ value, onChange, onPopularClick }) => {
  // Kullanıcının yazdığını ekranda anında görmek için yerel state
  const [inputValue, setInputValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const popularCategories = ['Dünya Klasikleri', 'Tarih', 'Bilim Kurgu', 'Edebiyat'];

  // 2 saniyelik debounce süresinin aktif olup olmadığını kontrol et
  const isWaiting = inputValue !== (value || '');

  // Üst bileşenden 'value' değişirse input'u eşitle
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // 2 saniyelik bekleme (Debounce) mantığı
  useEffect(() => {
    if (inputValue === value) return;

    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 2000); // 2000 ms = 2 saniye

    return () => clearTimeout(timer);
  }, [inputValue, onChange, value]);

  const handleCategoryClick = (cat) => {
    setInputValue(cat);
    onPopularClick(cat);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.15 }}
      className="w-full max-w-2xl px-2 sm:px-4 shrink-0 mb-12"
    >
      {/* Arama Kutusu Kapsayıcısı */}
      <motion.div
        animate={{ y: isFocused ? -2 : 0, scale: isFocused ? 1.005 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative group"
      >
        {/* Input Odaklandığında (Focus) Beliren Arka Plan Işıltısı */}
        <motion.div
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.02 : 0.95,
          }}
          transition={{ duration: 0.35 }}
          className="absolute -inset-1 bg-gradient-to-r from-[#A06A42]/0 via-[#A06A42]/25 to-[#A06A42]/0 rounded-3xl blur-xl pointer-events-none -z-10"
        />

        {/* Sol İkon: AnimatePresence ile Büyüteç ve Loader Arasında Yumuşak Geçiş */}
        <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
          <AnimatePresence mode="wait" initial={false}>
            {isWaiting ? (
              <motion.span
                key="loader"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="text-[#A06A42] flex items-center"
              >
                <Icon name="loader" size={22} spin variant="primary" />
              </motion.span>
            ) : (
              <motion.span
                key="search"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: isFocused ? 1.12 : 1,
                  rotate: isFocused ? 8 : 0,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className={`flex items-center transition-colors duration-200 ${
                  isFocused ? 'text-[#A06A42]' : 'text-[#1E2A20]'
                }`}
              >
                <Icon name="search" size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Arama Inputu */}
        <input
          type="text"
          placeholder="Kitap adı, yazar veya kategori ara..."
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-[#FFFDFB] border-2 border-[#DCD5CB] rounded-2xl md:rounded-3xl py-4.5 md:py-5 pl-14 pr-12 text-base text-[#121A13] font-semibold placeholder-[#2B3B2E]/60 focus:outline-none focus:border-[#A06A42] focus:bg-white focus:ring-4 focus:ring-[#A06A42]/10 shadow-md hover:shadow-lg focus:shadow-xl transition-colors duration-300"
        />

        {/* Sağ Taraf: Metin Varken Yaylanarak Beliren Temizleme (X) Butonu */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <AnimatePresence>
            {inputValue && (
              <motion.button
                key="clear-btn"
                type="button"
                initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.4, rotate: 45 }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                onClick={handleClear}
                title="Aramayı Temizle"
                className="p-1.5 rounded-full text-[#2B3B2E]/60 hover:text-[#A06A42] hover:bg-[#A06A42]/10 transition-colors cursor-pointer"
              >
                <Icon name="x" size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 2 Saniyelik Bekleme Süresini Gösteren Framer Motion İlerleme Çubuğu */}
        <AnimatePresence>
          {isWaiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-6 right-6 h-[3px] overflow-hidden rounded-full pointer-events-none"
            >
              <motion.div
                key={inputValue} // Her yeni tuş vuruşunda çubuğu sıfırdan başlatır
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: 'linear' }}
                style={{ originX: 0 }}
                className="w-full h-full bg-gradient-to-r from-[#A06A42]/40 via-[#A06A42] to-[#1E2A20] rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* HIZLI ARAMA ETİKETLERİ */}
      <AnimatePresence initial={false}>
        {!inputValue && (
          <motion.div
            key="popular-categories"
            variants={categoriesContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 py-1 text-xs">
              <motion.span
                variants={categoryPillVariants}
                className="inline-flex items-center gap-1 font-bold text-[#2B3B2E]"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon name="sparkles" size={13} variant="primary" />
                </motion.span>
                Popüler Kategoriler:
              </motion.span>

              {popularCategories.map((cat) => (
                <motion.button
                  key={cat}
                  type="button"
                  variants={categoryPillVariants}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleCategoryClick(cat)}
                  className="bg-[#A06A42]/5 hover:bg-[#A06A42] text-[#A06A42] hover:text-white border border-[#A06A42]/30 px-3.5 py-1.5 rounded-full font-bold cursor-pointer shadow-2xs hover:shadow-md transition-colors duration-200"
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
