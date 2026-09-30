import React, { useState } from 'react';
import { Home, BookOpen, Users, Info, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#708072] px-4 md:px-8 py-3 shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO & BAŞLIK (SOL) */}
        <div className="flex items-center space-x-2 cursor-pointer group">
          {/* logo görseli. Gerçek projede import ettiğiniz logo dosyasını src'ye verebilirsiniz */}
          <img 
            src="/logo.png" // Veya logo dosyanızın yolu
            alt="KitApp Logo" 
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Logo görseli yüklenemezse veya bulunamazsa alternatif olarak ikon göster
              e.target.style.display = 'none';
            }}
          />
          <span className="text-2xl font-bold text-[#d7beb1] tracking-wide font-sans">
            Kit<span className="opacity-90">App</span>
          </span>
        </div>

        {/* ORTA MENÜ (MASAÜSTÜ) */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#home" 
            className="flex items-center gap-1.5 text-[#d7beb1] font-semibold hover:opacity-80 transition-opacity"
          >
            <Home size={18} />
            <span>Ana Sayfa</span>
          </a>
          <a 
            href="#books" 
            className="flex items-center gap-1.5 text-[#d7beb1] font-semibold hover:opacity-80 transition-opacity"
          >
            <BookOpen size={18} />
            <span>Kitaplar</span>
          </a>
          <a 
            href="#authors" 
            className="flex items-center gap-1.5 text-[#d7beb1] font-semibold hover:opacity-80 transition-opacity"
          >
            <Users size={18} />
            <span>Yazarlar</span>
          </a>
          <a 
            href="#about" 
            className="flex items-center gap-1.5 text-[#d7beb1] font-semibold hover:opacity-80 transition-opacity"
          >
            <Info size={18} />
            <span>Hakkımızda</span>
          </a>
        </div>

        {/* GİRİŞ YAP BUTONU (SAĞ MASAÜSTÜ) */}
        <div className="hidden md:block">
          <button className="flex items-center gap-2 bg-[#d7beb1] text-[#708072] px-5 py-2 rounded-full font-bold shadow hover:bg-opacity-90 active:scale-95 transition-all duration-200">
            <LogIn size={18} />
            Giriş Yap
          </button>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[#d7beb1] focus:outline-none p-1 hover:bg-[#d7beb1]/10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* MOBİL AÇILIR MENÜ */}
      {isOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#d7beb1]/20 space-y-3 animate-fade-in">
          <a 
            href="#home" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#d7beb1] font-semibold py-2 px-3 hover:bg-[#d7beb1]/10 rounded-lg transition-colors"
          >
            <Home size={20} />
            <span>Ana Sayfa</span>
          </a>
          <a 
            href="#books" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#d7beb1] font-semibold py-2 px-3 hover:bg-[#d7beb1]/10 rounded-lg transition-colors"
          >
            <BookOpen size={20} />
            <span>Kitaplar</span>
          </a>
          <a 
            href="#authors" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#d7beb1] font-semibold py-2 px-3 hover:bg-[#d7beb1]/10 rounded-lg transition-colors"
          >
            <Users size={20} />
            <span>Yazarlar</span>
          </a>
          <a 
            href="#about" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#d7beb1] font-semibold py-2 px-3 hover:bg-[#d7beb1]/10 rounded-lg transition-colors"
          >
            <Info size={20} />
            <span>Hakkımızda</span>
          </a>
          
          <div className="pt-2 border-t border-[#d7beb1]/10">
            <button 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#d7beb1] text-[#708072] py-3 rounded-xl font-bold shadow hover:bg-opacity-90 transition-all duration-200"
            >
              <LogIn size={20} />
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
