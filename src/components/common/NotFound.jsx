// src/components/common/NotFound.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const NotFound = ({
  icon = "search",
  title = "Sonuç Bulunamadı",
  message = "Aradığınız kriterlere uygun herhangi bir kayıt bulunamadı.",
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center w-full ${className}`}
    >
      {/* İkon Kapsayıcısı */}
      <motion.div
        initial={{ scale: 0.5, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] flex items-center justify-center mb-4 shadow-inner"
      >
        <Icon name={icon} size={32} variant="primary" />
      </motion.div>

      {/* Başlık */}
      <h3 className="text-base sm:text-lg font-black text-[#121A13] mb-1.5">
        {title}
      </h3>

      {/* Açıklama Metni */}
      <p className="text-xs sm:text-sm font-medium text-[#2B3B2E]/70 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {/* Opsiyonel Aksiyon Butonu (Örn: Aramayı Temizle / Geri Dön) */}
      {actionText && onAction && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={onAction}
          className="bg-[#A06A42] hover:bg-[#85542E] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default NotFound;
