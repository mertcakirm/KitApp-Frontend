import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../common/Icon';
import { BookApi } from '../../api/bookApi';
import { FILEBASE_URL } from '../../api/api';

const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.replace(/\\/g, '/');
  return `${FILEBASE_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};

const UpdateBookModal = ({ isOpen, book, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      setTitle(book.title || '');
      setDescription(book.description || '');
      setCoverFile(null);
      setCoverPreview(getFileUrl(book.coverImage));
    }
  }, [book, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isUpdating) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isUpdating, onClose]);

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  if (!isOpen || !book) return null;

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!book?.id) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }


      await BookApi.update(book.id, formData);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Kitap güncellenirken hata oluştu:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return createPortal(
    <div
      onClick={() => !isUpdating && onClose()}
      className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#EADFCF] pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#2B3B2E]">
            Kitap Bilgilerini Güncelle
          </h3>
          <button
            type="button"
            disabled={isUpdating}
            onClick={onClose}
            className="text-[#2B3B2E]/50 hover:text-[#2B3B2E] text-sm font-bold cursor-pointer disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Kapak Görseli Güncelleme */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Kapak Görseli
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-22 rounded-xl overflow-hidden border border-[#EADFCF] bg-[#FAF6F0] shrink-0 flex items-center justify-center">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Kapak Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="book" size={20} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="block w-full text-xs text-[#2B3B2E]/70 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border file:border-[#EADFCF] file:text-xs file:font-black file:uppercase file:bg-[#FAF6F0] file:text-[#2B3B2E] hover:file:bg-[#A06A42] hover:file:text-[#FFFDFB] file:transition-all file:cursor-pointer"
              />
            </div>
          </div>

          {/* Kitap Başlığı */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Kitap Başlığı
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] focus:outline-none focus:border-[#A06A42]"
            />
          </div>

          {/* Kitap Açıklaması */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Açıklama
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] focus:outline-none focus:border-[#A06A42] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EADFCF]">
            <button
              type="button"
              disabled={isUpdating}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EADFCF] text-[#2B3B2E] hover:bg-[#FAF6F0] text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-[#A06A42] hover:bg-[#A06A42]/90 text-[#FFFDFB] text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateBookModal;
