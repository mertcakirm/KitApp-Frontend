import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
// Kendi API dosyanızın yoluna göre güncelleyin (örn: AuthApi veya AdminApi)
import { AuthApi } from '../../api/authApi';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Popup her açıldığında veya kapandığında alanları sıfırla
  useEffect(() => {
    if (!isOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  const handlePasswordChange = async () => {
    if (loading || success) return;
    setError("");

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Yeni şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Yeni şifreniz mevcut şifrenizden farklı olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      await AuthApi.changePassword({
        oldPassword,
        newPassword
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Şifre değiştirilirken hata oluştu:", err);
      setError(
        err.response?.data?.message || "Şifre değiştirilirken bir hata oluştu. Mevcut şifrenizi kontrol edin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Input içinde Enter tuşuna basılırsa işlemi tetikle
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordChange();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Karartılmış Arka Plan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !loading && onClose()}
            className="fixed inset-0 bg-[#2B3B2E]/40 backdrop-blur-xs"
          />

          {/* Modal Kutusu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-2xl p-6 shadow-xl z-10 overflow-hidden"
          >
            {/* Üst Başlık */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EADFCF]/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center text-[#A06A42] shrink-0">
                  <Icon name="shield" size={18} variant="primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-[#2B3B2E] tracking-tight">
                    Şifre Değiştir
                  </h3>
                  <p className="text-xs text-[#2B3B2E]/65 font-medium">
                    Hesap güvenliğiniz için güçlü bir şifre belirleyin.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !loading && onClose()}
                disabled={loading}
                className="text-[#2B3B2E]/40 hover:text-[#2B3B2E] transition-colors text-sm font-black cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* İçerik Alanı (Form etiketi olmadan div ile) */}
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-xs font-bold text-[#2B3B2E] placeholder-[#2B3B2E]/30 focus:outline-none focus:border-[#A06A42] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="En az 6 karakter"
                  disabled={loading || success}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-xs font-bold text-[#2B3B2E] placeholder-[#2B3B2E]/30 focus:outline-none focus:border-[#A06A42] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Yeni şifrenizi doğrulayın"
                  disabled={loading || success}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-xs font-bold text-[#2B3B2E] placeholder-[#2B3B2E]/30 focus:outline-none focus:border-[#A06A42] transition-colors"
                />
              </div>

              {/* Hata Bildirimi */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <Icon name="alert" size={14} />
                  <span>{error}</span>
                </div>
              )}

              {/* Başarı Bildirimi */}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Icon name="sparkles" size={14} />
                  <span>Şifreniz başarıyla güncellendi!</span>
                </div>
              )}

              {/* Alt Butonlar */}
              <div className="pt-3 border-t border-[#EADFCF]/70 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading || success}
                  className="px-4 py-2 rounded-xl border border-[#EADFCF] bg-[#FAF6F0] text-xs font-bold text-[#2B3B2E] hover:border-[#A06A42] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={loading || success}
                  className="px-5 py-2 rounded-xl bg-[#A06A42] hover:bg-[#8B5A36] text-[#FFFDFB] text-xs font-black flex items-center gap-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Icon name="loader" size={14} spin />
                      <span>Güncelleniyor...</span>
                    </>
                  ) : (
                    <span>Şifreyi Güncelle</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
