import React, { useState } from 'react';
import { Mail, Lock, LogIn, User, Eye, EyeOff, FileDown, AlertCircle, UserPlus } from 'lucide-react';
import { AuthApi } from '../api/AuthApi';
import { setCookie } from '../utils/cookie';
import logo from '../assets/logo.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await AuthApi.login({
          email: formData.email,
          password: formData.password
        });

        if (data && data.token) {
          const cookieDays = rememberMe ? 30 : 7;
          setCookie('token', data.token, cookieDays);
          window.location.href = '/';
        }
      } else {
        const data = await AuthApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (data && data.token) {
          setCookie('token', data.token, 7);
          window.location.href = '/';
        } else {
          setIsLogin(true);
          setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        }
      }
    } catch (err) {
      console.error("Auth Hatası:", err);
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-screen bg-[#FAF8F5] flex items-center justify-center p-4 md:p-6 font-sans transition-colors duration-300 overflow-hidden">
      <div className="bg-[#FAF8F5]/50 backdrop-blur-md border border-[#E3DFD8] rounded-3xl shadow-lg flex max-w-4xl w-full max-h-[92%] md:max-h-[520px] overflow-hidden transition-all duration-300">
        
        <div className="hidden md:flex md:w-1/2 bg-[#3C4A3E]/5 p-6 lg:p-8 flex-col justify-between border-r border-[#E3DFD8] overflow-hidden">
          <div className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="KitApp Logo" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg font-bold text-[#3C4A3E] tracking-tight">
              Kit<span className="text-[#3C4A3E]/80 font-medium">App</span>
            </span>
          </div>

          <div className="space-y-4 my-auto pt-4 relative">
            <div className="relative">
              <div className="absolute -top-10 -left-3 text-7xl text-[#3C4A3E]/5 font-serif font-bold select-none">“</div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#3C4A3E] leading-snug tracking-tight">
                Aradığınız kitapların PDF’lerine anında ulaşın.
              </h1>
              <p className="text-[#3C4A3E]/80 text-xs lg:text-sm mt-2 leading-relaxed">
                İstediğiniz kitapların PDF'lerini indirin, kendi çevrimdışı arşivinizi oluşturun ve dilediğiniz cihazda okumaya başlayın.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-[#FAF8F5]/85 p-3 rounded-xl border border-[#E3DFD8]/60 shadow-sm max-w-sm">
              <div className="bg-[#D4C5B9] text-[#3C4A3E] p-2 rounded-lg shadow-sm shrink-0">
                <FileDown size={18} className="opacity-90" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[#3C4A3E] font-semibold text-xs truncate">Zengin PDF Arşivi</h4>
                <p className="text-[#3C4A3E]/70 text-[10px] lg:text-xs truncate">Binlerce kitap PDF'ini saniyeler içinde indirin.</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#3C4A3E]/50 mt-2">
            © {new Date().getFullYear()} KitApp. Tüm hakları saklıdır.
          </div>
        </div>

        <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col justify-center bg-white/40 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-none">
          <div className="flex md:hidden items-center justify-center space-x-2 mb-3">
            <img 
              src={logo} 
              alt="KitApp Logo" 
              className="h-7 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg font-bold text-[#3C4A3E] tracking-tight">
              Kit<span className="text-[#3C4A3E]/85 font-medium">App</span>
            </span>
          </div>

          <div className="text-center md:text-left mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-[#3C4A3E] tracking-tight">
              {isLogin ? 'Tekrar Hoş Geldiniz!' : 'Aramıza Katılın!'}
            </h2>
            <p className="text-[#3C4A3E]/75 text-xs mt-1">
              {isLogin 
                ? "Kitap PDF'lerini hızlıca indirmek için hesabınıza giriş yapın." 
                : 'Hemen ücretsiz kaydolun ve dilediğiniz PDF’i indirin.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-700/80 p-2.5 rounded-lg flex items-center gap-2 text-[11px] mb-3.5">
              <AlertCircle size={14} className="shrink-0 opacity-80" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#3C4A3E]/85 uppercase tracking-wider block">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C4A3E]/45">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="yazaradi veya okuradi"
                    className="w-full bg-[#FAF8F5]/80 border border-[#E3DFD8] rounded-lg py-2 pl-9 pr-3 text-[#3C4A3E] placeholder-[#3C4A3E]/40 focus:outline-none focus:border-[#3C4A3E]/50 focus:bg-white focus:ring-1 focus:ring-[#3C4A3E]/10 transition-all duration-200 text-xs shadow-inner"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#3C4A3E]/85 uppercase tracking-wider block">
                {isLogin ? 'E-posta veya Kullanıcı Adı' : 'E-posta Adresi'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C4A3E]/45">
                  <Mail size={15} />
                </div>
                <input
                  type={isLogin ? 'text' : 'email'}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={isLogin ? "örnek@mail.com veya yazaradi" : "örnek@mail.com"}
                  className="w-full bg-[#FAF8F5]/80 border border-[#E3DFD8] rounded-lg py-2 pl-9 pr-3 text-[#3C4A3E] placeholder-[#3C4A3E]/40 focus:outline-none focus:border-[#3C4A3E]/50 focus:bg-white focus:ring-1 focus:ring-[#3C4A3E]/10 transition-all duration-200 text-xs shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-[#3C4A3E]/85 uppercase tracking-wider">
                  Şifre
                </label>
                {isLogin && (
                  <a href="#forgot" className="text-[10px] text-[#3C4A3E]/75 hover:text-[#3C4A3E] hover:underline transition-colors font-semibold font-sans">
                    Şifreyi Unuttum?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C4A3E]/45">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5]/80 border border-[#E3DFD8] rounded-lg py-2 pl-9 pr-9 text-[#3C4A3E] placeholder-[#3C4A3E]/40 focus:outline-none focus:border-[#3C4A3E]/50 focus:bg-white focus:ring-1 focus:ring-[#3C4A3E]/10 transition-all duration-200 text-xs shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#3C4A3E]/40 hover:text-[#3C4A3E] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center pt-0.5">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#E3DFD8] bg-[#FAF8F5] text-[#3C4A3E] focus:ring-offset-0 focus:ring-1 focus:ring-[#3C4A3E]/20 accent-[#3C4A3E] cursor-pointer"
                />
                <label htmlFor="remember_me" className="ml-2 text-[11px] font-medium text-[#3C4A3E]/75 cursor-pointer select-none">
                  Beni Hatırla
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4C5B9] hover:bg-[#C9BAAD] active:scale-[0.98] text-[#3C4A3E] font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:pointer-events-none text-xs"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-2 border-[#3C4A3E] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? <LogIn size={15} className="opacity-80" /> : <UserPlus size={15} className="opacity-80" />}
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-5 border-t border-[#E3DFD8]/40 pt-4">
            <p className="text-[11px] text-[#3C4A3E]/70 font-medium">
              {isLogin ? 'Henüz bir hesabınız yok mu? ' : 'Zaten bir hesabınız var mı? '}
              <button 
                type="button" 
                onClick={toggleAuthMode}
                className="text-[#3C4A3E] font-bold hover:underline cursor-pointer focus:outline-none ml-1"
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
