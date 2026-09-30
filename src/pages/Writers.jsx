// src/pages/Writers.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/common/Icon';
import Loading from '../components/common/Loading';
import NotFound from '../components/common/NotFound';
import PageHeader from '../components/Home/PageHeader';
// import { WriterApi } from '../api/writerApi'; // API bağlantınız hazır olduğunda açabilirsiniz

const Writers = () => {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Örnek Yazar Verileri (API bağlantısı yapılana kadar test amaçlı)
  useEffect(() => {
    const timer = setTimeout(() => {
      setWriters([
        { id: 1, name: 'Sabahattin Ali', bookCount: 14, category: 'Roman & Öykü', bio: 'Kürk Mantolu Madonna ve Kuyucaklı Yusuf gibi ölümsüz eserlerin yazarı.' },
        { id: 2, name: 'Orhan Pamuk', bookCount: 22, category: 'Modern Edebiyat', bio: 'Nobel Edebiyat Ödüllü Türk yazar ve akademisyen.' },
        { id: 3, name: 'Yaşar Kemal', bookCount: 35, category: 'Destan & Roman', bio: 'İnce Memed serisiyle Türk edebiyatının dünya çapındaki güçlü kalemi.' },
        { id: 4, name: 'Ahmet Hamdi Tanpınar', bookCount: 12, category: 'Şiir & Roman', bio: 'Zaman teması ve psikolojik derinliğiyle tanınan usta yazar.' },
        { id: 5, name: 'Peyami Safa', bookCount: 28, category: 'Psikolojik Roman', bio: 'Dokuzuncu Hariciye Koğuşu ve Fatih-Harbiye eserlerinin yaratıcısı.' },
        { id: 6, name: 'Oğuz Atay', bookCount: 6, category: 'Postmodernizm', bio: 'Tutunamayanlar ve Tehlikeli Oyunlar ile Türk edebiyatında çığır açan yazar.' },
      ]);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Filtreleme mantığı
  const filteredWriters = writers.filter((writer) =>
    writer.name.toLowerCase().includes(search.toLowerCase()) ||
    writer.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      
      {/* 1. SAYFA BAŞLIĞI */}
      <PageHeader 
        badgeText="Yazar Arşivi"
        title="Kütüphanemizin Değerli"
        subtitle="Sistemimizde eserleri bulunan yazarları keşfedin, kaleme aldıkları PDF kitap arşivlerine göz atın."
      />

      {/* 2. BASİT ARAMA KUTUSU */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
        className="w-full max-w-md mb-10 relative"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2B3B2E]/50">
          <Icon name="search" size={18} />
        </div>
        <input
          type="text"
          placeholder="Yazar adı veya kategori ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#FFFDFB] border-2 border-[#DCD5CB] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#121A13] font-semibold placeholder-[#2B3B2E]/50 focus:outline-none focus:border-[#A06A42] focus:bg-white focus:ring-4 focus:ring-[#A06A42]/10 shadow-sm transition-all duration-200"
        />
      </motion.div>

      {/* 3. İÇERİK ALANI */}
      <div className="w-full max-w-6xl pb-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <Loading key="loading" message="Yazarlar listeleniyor..." />
          ) : filteredWriters.length > 0 ? (
            <motion.div
              key="writers-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
            >
              {filteredWriters.map((writer, index) => (
                <motion.div
                  key={writer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 280, damping: 24 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#A06A42]/50 transition-colors duration-300 group cursor-pointer"
                >
                  <div>
                    {/* Üst Kısım: Kategori ve Kitap Sayısı Rozeti */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] text-[10px] font-extrabold px-3 py-1 rounded-full">
                        {writer.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B3B2E]/70 bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#DCD5CB]/60">
                        <Icon name="bookOpen" size={13} variant="primary" />
                        <span>{writer.bookCount} Kitap</span>
                      </div>
                    </div>

                    {/* Yazar Adı (Resimsiz, Şık Tipografi) */}
                    <h3 className="text-xl font-black text-[#121A13] group-hover:text-[#A06A42] transition-colors mb-2">
                      {writer.name}
                    </h3>

                    {/* Kısa Özgeçmiş / Açıklama */}
                    <p className="text-xs sm:text-sm text-[#2B3B2E]/80 font-medium leading-relaxed line-clamp-2">
                      {writer.bio}
                    </p>
                  </div>

                  {/* Alt Kısım: Eserleri Gör Butonu */}
                  <div className="mt-6 pt-4 border-t border-[#EADFCF]/60 flex items-center justify-between text-xs font-bold text-[#A06A42]">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Yazarın Eserlerini İncele
                    </span>
                    <Icon name="arrowRight" size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <NotFound
              key="not-found"
              icon="user"
              title="Yazar Bulunamadı"
              message={`"${search}" aramasıyla eşleşen herhangi bir yazar bulunamadı.`}
              actionText="Aramayı Temizle"
              onAction={() => setSearch('')}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

Writers.displayName = 'Writers';

export default Writers;
