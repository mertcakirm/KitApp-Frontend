import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/common/Icon';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
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

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
  hover: {
    y: -6,
    transition: { type: 'spring', stiffness: 350, damping: 20 },
  },
};

const iconBoxVariants = {
  hidden: { scale: 1, rotate: 0 },
  visible: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.12,
    rotate: 6,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
};

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: 'library', value: '10.000+', label: 'Kitap Arşivi' },
    { icon: 'users', value: '50.000+', label: 'Kitapsever' },
    { icon: 'compass', value: '40+', label: 'Farklı Kategori' },
    { icon: 'award', value: '%99', label: 'Okur Memnuniyeti' },
  ];

  const features = [
    {
      icon: 'bookOpen',
      title: 'Zengin Edebiyat Arşivi',
      description: 'Dünya klasiklerinden modern bilim kurguya, tarihten felsefeye kadar binlerce eseri tek bir çatı altında topluyoruz.'
    },
    {
      icon: 'sparkles',
      title: 'Hızlı ve Akıllı Keşif',
      description: 'Gelişmiş arama ve kategori filtreleme sistemimizle ruh halinize ve ilgi alanınıza en uygun kitabı saniyeler içinde bulun.'
    },
    {
      icon: 'coffee',
      title: 'Sıcak Okuma Deneyimi',
      description: 'Göz yormayan doğal renk paletimiz ve sade tasarımımızla, dijital ortamda gerçek bir kütüphane huzuru sunuyoruz.'
    },
    {
      icon: 'heart',
      title: 'Okur Odaklı Topluluk',
      description: 'Kitap tutkunlarının yeni dünyalar keşfetmesini kolaylaştıran, kültür ve sanat odaklı yaşayan bir platformuz.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#121A13] overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. HERO BÖLÜMÜ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
            animate={{
              opacity: [0.14, 0.26, 0.14],
              scale: [1, 1.1, 1],
              x: '-50%',
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-10 left-1/2 w-72 h-72 bg-[#A06A42] rounded-full blur-3xl pointer-events-none -z-10"
          />

          <motion.div variants={fadeUpItem}>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex items-center gap-2 bg-[#A06A42]/10 border border-[#A06A42]/30 text-[#A06A42] px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-2xs"
            >
              <Icon name="sparkles" size={16} />
              <span>Bizim Hikayemiz</span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#121A13] mb-6 leading-tight"
          >
            Kelimelerin İzinde, <br />
            <span className="text-[#A06A42]">Yeni Dünyalar</span> Keşfedin
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="text-lg sm:text-xl text-[#2B3B2E]/80 font-medium leading-relaxed"
          >
            Okuma tutkusunu dijital dünyanın hızıyla buluşturuyoruz. Aradığınız her kitaba, yazara ve edebi akıma en zahmetsiz ve keyifli yoldan ulaşmanız için buradayız.
          </motion.p>
        </motion.div>

        {/* 2. İSTATİSTİK KARTLARI */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white border-2 border-[#DCD5CB] hover:border-[#A06A42] rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-colors duration-300 group cursor-default"
            >
              <motion.div
                variants={iconBoxVariants}
                className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#A06A42]/10 text-[#A06A42] flex items-center justify-center group-hover:bg-[#A06A42] group-hover:text-white transition-colors duration-300"
              >
                <Icon name={stat.icon} size={24} />
              </motion.div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#121A13] mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#2B3B2E]/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3. ÖZELLİKLER & NEDEN BİZ? */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mb-24"
        >
          <motion.div variants={fadeUpItem} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#121A13] mb-3">
              Platformumuzda Sizi Neler Bekliyor?
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="w-20 h-1.5 bg-[#A06A42] mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-[#FFFDFB] border-2 border-[#DCD5CB] rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row items-start gap-5 hover:border-[#A06A42] hover:bg-white shadow-md hover:shadow-xl transition-colors duration-300 group"
              >
                <motion.div
                  variants={iconBoxVariants}
                  className="p-4 rounded-2xl bg-[#1E2A20] text-[#FFFDFB] group-hover:bg-[#A06A42] transition-colors duration-300 shrink-0"
                >
                  <Icon name={feature.icon} size="xl" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-[#121A13] mb-2 group-hover:text-[#A06A42] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#2B3B2E]/80 text-sm sm:text-base leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. VİZYON & CTA (YÖNLENDİRME) BÖLÜMÜ */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          className="relative bg-[#1E2A20] text-[#FFFDFB] rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-16 -top-16 w-64 h-64 border-4 border-[#A06A42]/20 rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-16 -bottom-16 w-64 h-64 border-4 border-[#A06A42]/20 rounded-full pointer-events-none"
          />

          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 relative z-10">
            Sıradaki Favori Kitabınız Bir Tık Uzağınızda
          </h2>
          <p className="text-[#DCD5CB] max-w-2xl mx-auto mb-8 text-base sm:text-lg font-medium relative z-10">
            Binlerce eser arasında kaybolmadan, tam aradığınız hikayeyi bulmak için hemen kütüphanemize göz atın.
          </p>

          <motion.button
            type="button"
            onClick={() => navigate('/')}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="inline-flex items-center gap-3 bg-[#A06A42] hover:bg-[#8b5935] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-colors duration-200 cursor-pointer relative z-10"
          >
            <span>Kitapları Keşfetmeye Başla</span>
            <motion.span
              variants={{
                rest: { x: 0 },
                hover: { x: 6, transition: { type: 'spring', stiffness: 400, damping: 15 } },
              }}
              className="flex items-center"
            >
              <Icon name="arrowRight" size={20} />
            </motion.span>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
