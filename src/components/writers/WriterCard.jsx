import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../common/Icon';

const WriterCard = ({ writer, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.05, type: 'spring', stiffness: 280, damping: 24 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#A06A42]/50 transition-colors duration-300 group cursor-pointer"
    >
      <a href={`/author-detail/${writer.id}`} className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {writer.role?.name === 'writer' ? 'Yazar' : (writer.role?.name || 'Yazar')}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B3B2E]/70 bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#DCD5CB]/60">
              <Icon name="bookOpen" size={13} variant="primary" />
              <span>{writer.bookCount ?? 0} Kitap</span>
            </div>
          </div>

          <h3 className="text-xl font-black text-[#121A13] group-hover:text-[#A06A42] transition-colors mb-2">
            {writer.username}
          </h3>

          {writer.createdAt && (
            <p className="text-[11px] text-[#2B3B2E]/50 font-semibold mt-2">
              Katılım: {formatDate(writer.createdAt)}
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EADFCF]/60 flex items-center justify-between text-xs font-bold text-[#A06A42]">
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            Yazarın Profilini İncele
          </span>
          <Icon name="arrowRight" size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
        </div>
      </a>
    </motion.div>
  );
};

export default WriterCard;
