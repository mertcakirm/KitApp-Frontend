import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "İşlemi Onayla",
  message = "Bu işlemi gerçekleştirmek istediğinize emin misiniz?",
  highlightText = "",
  confirmText = "Evet, Onayla",
  cancelText = "Vazgeç",
  loading = false,
  loadingText = "İşleniyor...",
  error = "",
  variant = "danger" // "danger" | "success" | "warning"
}) => {
  const variantStyles = {
    danger: {
      iconBg: "bg-rose-50 border-rose-200 text-rose-600",
      iconName: "alert",
      button: "bg-rose-600 hover:bg-rose-700 text-[#FFFDFB]"
    },
    success: {
      iconBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
      iconName: "sparkles",
      button: "bg-emerald-600 hover:bg-emerald-700 text-[#FFFDFB]"
    },
    warning: {
      iconBg: "bg-amber-50 border-amber-200 text-amber-600",
      iconName: "alert",
      button: "bg-[#A06A42] hover:bg-[#8B5A36] text-[#FFFDFB]"
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles.danger;

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

          {/* Popup Kutusu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-2xl p-6 shadow-xl z-10 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${currentStyle.iconBg}`}>
                <Icon name={currentStyle.iconName} size={20} />
              </div>

              <div className="flex-1 space-y-1.5">
                <h3 className="text-base md:text-lg font-black text-[#2B3B2E] tracking-tight">
                  {title}
                </h3>
                <p className="text-xs md:text-sm text-[#2B3B2E]/75 font-medium leading-relaxed">
                  {highlightText && (
                    <strong className="font-black text-[#2B3B2E] bg-[#FAF6F0] px-1.5 py-0.5 rounded border border-[#EADFCF] mr-1">
                      {highlightText}
                    </strong>
                  )}
                  {message}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <Icon name="alert" size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#EADFCF]/70 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-[#EADFCF] bg-[#FAF6F0] text-xs font-bold text-[#2B3B2E] hover:border-[#A06A42] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer ${currentStyle.button}`}
              >
                {loading ? (
                  <>
                    <Icon name="loader" size={14} spin />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <span>{confirmText}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
