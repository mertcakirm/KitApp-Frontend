// src/components/common/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

// Hızlı öneriler kapsayıcısı için sıralı (stagger) animasyon varyantı
const suggestionsContainerVariants = {
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

// Her bir öneri butonu için yaylanma varyantı
const suggestionPillVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 20 },
  },
};

const DEFAULT_SUGGESTIONS = ['Dünya Klasikleri', 'Tarih', 'Bilim Kurgu', 'Edebiyat'];

const SIZE_CONFIG = {
  sm: {
    input: 'py-2.5 pl-10 pr-9 text-xs rounded-xl border',
    leftIconWrapper: 'pl-3.5',
    rightIconWrapper: 'pr-2.5',
    iconSize: 15,
    clearIconSize: 14,
    progressBar: 'left-3 right-3 h-[2px]',
  },
  md: {
    input: 'py-3.5 pl-12 pr-10 text-sm rounded-2xl border-2',
    leftIconWrapper: 'pl-4',
    rightIconWrapper: 'pr-3',
    iconSize: 18,
    clearIconSize: 16,
    progressBar: 'left-4 right-4 h-[2.5px]',
  },
  lg: {
    input: 'py-4.5 md:py-5 pl-14 pr-12 text-base rounded-2xl md:rounded-3xl border-2',
    leftIconWrapper: 'pl-5',
    rightIconWrapper: 'pr-4',
    iconSize: 22,
    clearIconSize: 18,
    progressBar: 'left-6 right-6 h-[3px]',
  },
};

const SearchBar = ({
  value = '',
  onChange,
  onPopularClick,
  onSuggestionClick,
  placeholder = 'Kitap ara...',
  debounceTime = 2000, // milisaniye (örn: 400, 1000, 2000)
  suggestions = DEFAULT_SUGGESTIONS, // String dizisi ['Tarih'] veya Obje dizisi [{ label: 'Tarih', value: 'tarih' }]
  suggestionsLabel = 'Popüler Kategoriler:',
  suggestionsIcon = 'sparkles',
  showSuggestions = true,
  showProgressBar = true,
  size = 'lg', // 'sm' | 'md' | 'lg'
  containerClassName = 'w-full max-w-2xl px-2 sm:px-4 shrink-0 mb-12',
  inputClassName = '',
  disabled = false,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const currentSize = SIZE_CONFIG[size] || SIZE_CONFIG.lg;
  const isWaiting = debounceTime > 0 && inputValue !== (value || '');

  // Dışarıdan value değişirse input'u senkronize et
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Dinamik Debounce Mekanizması
  useEffect(() => {
    if (inputValue === (value || '')) return;

    if (debounceTime <= 0) {
      onChange?.(inputValue);
      return;
    }

    const timer = setTimeout(() => {
      onChange?.(inputValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, value, debounceTime]);

  // Öneri etiketine tıklandığında hem yeni prop'u hem de eski onPopularClick prop'unu destekler
  const handleSuggestionSelect = (item) => {
    const selectedValue = typeof item === 'object' ? item.value : item;
    setInputValue(selectedValue);

    if (onSuggestionClick) {
      onSuggestionClick(selectedValue, item);
    } else if (onPopularClick) {
      onPopularClick(selectedValue);
    } else {
      onChange?.(selectedValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
  };

  // Enter tuşuna basıldığında süreyi beklemeden anında aramayı tetikler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue !== (value || '')) {
      onChange?.(inputValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.15 }}
      className={containerClassName}
    >
      <motion.div
        animate={{ y: isFocused ? -2 : 0, scale: isFocused ? 1.005 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative group"
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.02 : 0.95,
          }}
          transition={{ duration: 0.35 }}
          className="absolute -inset-1 bg-gradient-to-r from-[#A06A42]/0 via-[#A06A42]/25 to-[#A06A42]/0 rounded-3xl blur-xl pointer-events-none -z-10"
        />

        {/* Sol İkon: Büyüteç ve Loader Geçişi */}
        <span
          className={`absolute inset-y-0 left-0 ${currentSize.leftIconWrapper} flex items-center pointer-events-none z-10`}
        >
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
                <Icon name="loader" size={currentSize.iconSize} spin variant="primary" />
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
                <Icon name="search" size={currentSize.iconSize} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-[#FFFDFB] border-[#DCD5CB] text-[#121A13] font-semibold placeholder-[#2B3B2E]/60 focus:outline-none focus:border-[#A06A42] focus:bg-white focus:ring-4 focus:ring-[#A06A42]/10 shadow-md hover:shadow-lg focus:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 ${currentSize.input} ${inputClassName}`}
        />

        {/* Sağ Temizleme Butonu */}
        <div className={`absolute inset-y-0 right-0 ${currentSize.rightIconWrapper} flex items-center`}>
          <AnimatePresence>
            {inputValue && !disabled && (
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
                <Icon name="x" size={currentSize.clearIconSize} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dinamik Süreli Framer Motion İlerleme Çubuğu */}
        <AnimatePresence>
          {showProgressBar && isWaiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute bottom-0 ${currentSize.progressBar} overflow-hidden rounded-full pointer-events-none`}
            >
              <motion.div
                key={inputValue}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: debounceTime / 1000, ease: 'linear' }}
                style={{ originX: 0 }}
                className="w-full h-full bg-gradient-to-r from-[#A06A42]/40 via-[#A06A42] to-[#1E2A20] rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* HIZLI ÖNERİ / KATEGORİ ETİKETLERİ */}
      <AnimatePresence initial={false}>
        {showSuggestions && suggestions?.length > 0 && !inputValue && (
          <motion.div
            key="suggestions-list"
            variants={suggestionsContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 py-1 text-xs">
              {suggestionsLabel && (
                <motion.span
                  variants={suggestionPillVariants}
                  className="inline-flex items-center gap-1 font-bold text-[#2B3B2E]"
                >
                  {suggestionsIcon && (
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Icon name={suggestionsIcon} size={13} variant="primary" />
                    </motion.span>
                  )}
                  {suggestionsLabel}
                </motion.span>
              )}

              {suggestions.map((item, idx) => {
                const label = typeof item === 'object' ? item.label : item;
                const key = typeof item === 'object' ? item.value || idx : item;

                return (
                  <motion.button
                    key={key}
                    type="button"
                    variants={suggestionPillVariants}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSuggestionSelect(item)}
                    className="bg-[#A06A42]/5 hover:bg-[#A06A42] text-[#A06A42] hover:text-white border border-[#A06A42]/30 px-3.5 py-1.5 rounded-full font-bold cursor-pointer shadow-2xs hover:shadow-md transition-colors duration-200"
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
