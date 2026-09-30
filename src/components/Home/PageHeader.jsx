// src/components/PageHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../common/Icon';

// Ana kapsayıcı için sıralı (stagger) giriş varyantı
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

// Alt elemanların (Rozet, Başlık, Alt Başlık) yaylanarak giriş varyantı
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 22,
    },
  },
};

// Rozet üzerindeki ikonun hover varyantı
const badgeIconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: -14,
    scale: 1.15,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
};

const PageHeader = ({ badgeText = "Zengin PDF Kütüphanesi", title, subtitle }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative text-center space-y-3 md:space-y-4 max-w-2xl px-4 shrink-0 mb-8"
    >
      {/* Arka Plan Dekoratif Işıltı (Sonsuz Nefes Alma Efekti) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
        animate={{
          opacity: [0.12, 0.24, 0.12],
          scale: [1, 1.1, 1],
          x: '-50%',
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-6 left-1/2 w-56 h-32 bg-[#A06A42] rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* 1. ROZET (Badge) - Yaylanarak girer ve sürekli süzülür */}
      <motion.div variants={itemVariants}>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block"
        >
          <motion.div
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A06A42]/10 border border-[#A06A42]/20 text-xs font-bold text-[#A06A42] shadow-sm hover:bg-[#A06A42]/15 hover:border-[#A06A42]/40 transition-colors duration-200 cursor-default"
          >
            <motion.span variants={badgeIconVariants} className="flex items-center shrink-0">
              <Icon name="library" size={13} variant="primary" />
            </motion.span>
            <span>{badgeText}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 2. ANA BAŞLIK (Title) & Dinamik Alt Çizgi */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-4xl md:text-5xl font-black text-[#121A13] tracking-tight leading-tight"
      >
        {title}{' '}
        <span className="relative inline-block text-[#A06A42] font-serif font-semibold mt-1 sm:mt-0">
          Anında Ulaşın.
          {/* Soldan Sağa Uzayan Animasyonlu Alt Çizgi */}
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 0.45,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ originX: 0 }}
            className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#A06A42] via-[#A06A42]/60 to-transparent rounded-full"
          />
        </span>
      </motion.h1>

      {/* 3. ALT BAŞLIK (Subtitle) */}
      <motion.p
        variants={itemVariants}
        className="text-xs sm:text-sm text-[#2B3B2E] font-medium max-w-lg mx-auto leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};

export default PageHeader;
