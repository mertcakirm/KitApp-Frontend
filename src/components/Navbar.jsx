import React, { useState } from 'react';
import { Home, BookOpen, Users, Info, LogIn, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // "h-16" (64px) yüksekliği eklenerek navbar boyutu sabitlendi.
    <nav className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E3DFD8] px-4 md:px-8 h-16 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        
        {/* LOGO & BAŞLIK */}
        <div className="flex items-center space-x-2.5 cursor-pointer group">
          <img 
            src={logo}
            alt="KitApp Logo" 
            className="h-8.5 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold text-[#3C4A3E] tracking-tight font-sans">
            Kit<span className="text-[#3C4A3E]/80 font-medium">App</span>
          </span>
        </div>

        {/* ORTA MENÜ (MASAÜSTÜ) */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#home" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Home size={15} className="opacity-70" />
            <span>Ana Sayfa</span>
          </a>
          <a 
            href="#books" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <BookOpen size={15} className="opacity-70" />
            <span>Kitaplar</span>
          </a>
          <a 
            href="#authors" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Users size={15} className="opacity-70" />
            <span>Yazarlar</span>
          </a>
          <a 
            href="#about" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Info size={15} className="opacity-70" />
            <span>Hakkımızda</span>
          </a>
        </div>

        {/* GİRİŞ YAP BUTONU */}
        <div className="hidden md:block">
          <button className="flex items-center gap-2 bg-[#D4C5B9] hover:bg-[#C9BAAD] text-[#3C4A3E] px-5.5 py-2 rounded-full font-semibold text-sm shadow-sm active:scale-[0.98] transition-all duration-200">
            <LogIn size={15} className="opacity-80" />
            Giriş Yap
          </button>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[#3C4A3E] focus:outline-none p-2 hover:bg-[#3C4A3E]/5 rounded-xl transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* MOBİL AÇILIR MENÜ */}
      {isOpen && (
        <div className="md:hidden mt-0 pt-4 pb-4 border-t border-[#E3DFD8] space-y-2 bg-[#FAF8F5] relative left-0 right-0 z-50 animate-fade-in px-4">
          <a 
            href="#home" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
          >
            <Home size={17} className="opacity-70" />
            <span>Ana Sayfa</span>
          </a>
          <a 
            href="#books" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
          >
            <BookOpen size={17} className="opacity-70" />
            <span>Kitaplar</span>
          </a>
          <a 
            href="#authors" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
          >
            <Users size={17} className="opacity-70" />
            <span>Yazarlar</span>
          </a>
          <a 
            href="#about" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
          >
            <Info size={17} className="opacity-70" />
            <span>Hakkımızda</span>
          </a>
          
          <div className="pt-2 border-t border-[#E3DFD8]/65">
            <button 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#D4C5B9] hover:bg-[#C9BAAD] text-[#3C4A3E] py-3 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200"
            >
              <LogIn size={17} className="opacity-80" />
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
