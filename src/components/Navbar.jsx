import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './common/Icon';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookie';


const getProfileUrl = (roleName) => {
  if (!roleName) return '/profile';
  
  const role = roleName.toLowerCase();
  if (role === 'admin') return '/admin-panel';
  if (role === 'writer' || role === 'yazar') return '/author-panel';
  
  return '/profile';
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleName, setRoleName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = getCookie('roleName');
    if (storedRole) {
      setRoleName(storedRole);
    }
  }, []);

  const profileUrl = getProfileUrl(roleName);

  return (
    <nav className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E3DFD8] px-4 md:px-8 h-16 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        
        <a href='/' className="flex items-center space-x-2.5 cursor-pointer group">
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
        </a>

        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="/" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Icon name="home" size={15} className="opacity-70" />
            <span>Ana Sayfa</span>
          </a>
          <a 
            href="/authors" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Icon name="users" size={15} className="opacity-70" />
            <span>Yazarlar</span>
          </a>
          <a 
            href="/about" 
            className="relative flex items-center gap-2 text-[#3C4A3E]/85 hover:text-[#3C4A3E] font-medium text-sm transition-colors duration-200 py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#3C4A3E] hover:after:w-full after:transition-all after:duration-300"
          >
            <Icon name="info" size={15} className="opacity-70" />
            <span>Hakkımızda</span>
          </a>
        </div>

        <div className="hidden md:block">
          {roleName ? (
            <motion.a 
              href={profileUrl}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#3C4A3E]/10 hover:bg-[#3C4A3E]/15 border border-[#3C4A3E]/20 text-[#3C4A3E] px-4 py-2 rounded-full font-semibold text-xs transition-colors shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#3C4A3E] text-[#FFFDFB] flex items-center justify-center shrink-0">
                <Icon name="user" size={13} />
              </div>
              <span className="truncate max-w-[120px]">{roleName}</span>
            </motion.a>
          ) : (
            <a href='/login' className="flex items-center gap-2 bg-[#D4C5B9] hover:bg-[#C9BAAD] text-[#3C4A3E] px-5.5 py-2 rounded-full font-semibold text-sm shadow-sm active:scale-[0.98] transition-all duration-200">
              <Icon name="login" size={15} className="opacity-80" />
              Giriş Yap
            </a>
          )}
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[#3C4A3E] focus:outline-none p-2 hover:bg-[#3C4A3E]/5 rounded-xl transition-colors cursor-pointer"
          >
            <Icon name={isOpen ? "x" : "menu"} size={22} />
          </button>
        </div>

      </div>

      {/* MOBİL AÇILIR MENÜ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-4 border-t border-[#E3DFD8] space-y-2 bg-[#FAF8F5] px-4 overflow-hidden"
          >
            <a 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
            >
              <Icon name="home" size={17} className="opacity-70" />
              <span>Ana Sayfa</span>
            </a>
            <a 
              href="/authors" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
            >
              <Icon name="users" size={17} className="opacity-70" />
              <span>Yazarlar</span>
            </a>
            <a 
              href="/about" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-[#3C4A3E]/90 hover:text-[#3C4A3E] font-medium text-sm py-2.5 px-3 hover:bg-[#3C4A3E]/5 rounded-xl transition-all"
            >
              <Icon name="info" size={17} className="opacity-70" />
              <span>Hakkımızda</span>
            </a>
            
            <div className="pt-2 border-t border-[#E3DFD8]/65">
              {roleName ? (
                <a 
                  href={profileUrl}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#3C4A3E]/10 border border-[#3C4A3E]/20 text-[#3C4A3E] py-3 rounded-xl font-semibold text-xs shadow-2xs transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#3C4A3E] text-[#FFFDFB] flex items-center justify-center shrink-0">
                    <Icon name="user" size={13} />
                  </div>
                  <span>{roleName} (Paneli Git)</span>
                </a>
              ) : (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-[#D4C5B9] hover:bg-[#C9BAAD] text-[#3C4A3E] py-3 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <Icon name="login" size={17} className="opacity-80" />
                  Giriş Yap
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
