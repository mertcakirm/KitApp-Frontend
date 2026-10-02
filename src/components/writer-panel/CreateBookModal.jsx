import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../common/Icon';
import { BookApi } from '../../api/bookApi';
import { CategoryApi } from '../../api/categoryApi';

const MAX_CATEGORIES = 2;

const CreateBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [pdf, setPdf] = useState(null);
  const [categoryIds, setCategoryIds] = useState([]); // string[]

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await CategoryApi.getAll();
      // { count: 4, rows: [...] } yapısından rows dizisini al ve aktif olanları filtrele
      const rows = res?.rows || res?.data?.rows || [];
      const activeCategories = Array.isArray(rows)
        ? rows.filter((cat) => cat.isActive !== false)
        : [];
      setCategories(activeCategories);
    } catch (err) {
      console.error('Kategoriler alınırken hata oluştu:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCoverImage(null);
    setCoverPreview('');
    setPdf(null);
    setCategoryIds([]);
    setError('');
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdf(file);
    }
  };

  // Maksimum 2 kategori seçimine izin veren fonksiyon
  const toggleCategory = (id) => {
    const strId = String(id);

    setCategoryIds((prev) => {
      if (prev.includes(strId)) {
        return prev.filter((item) => item !== strId);
      }
      if (prev.length >= MAX_CATEGORIES) {
        return prev;
      }
      return [...prev, strId];
    });
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama alanları zorunludur.');
      return;
    }
    if (categoryIds.length === 0) {
      setError('Lütfen en az 1 kategori seçin (Maksimum 2).');
      return;
    }
    if (!coverImage) {
      setError('Lütfen bir kapak görseli seçin.');
      return;
    }
    if (!pdf) {
      setError('Lütfen bir PDF dosyası seçin.');
      return;
    }

    try {
      setIsSubmitting(true);

      await BookApi.create({
        title: title.trim(),
        description: description.trim(),
        coverImage,
        pdf,
        categoryIds, // string array (en fazla 2 elemanlı)
      });

      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Kitap eklenirken hata oluştu:', err);
      setError(err?.response?.data?.message || 'Kitap eklenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#EADFCF] pb-3">
          <div className="flex items-center gap-2 text-[#2B3B2E]">
            <Icon name="book" size={18} />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Yeni Kitap Ekle
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#2B3B2E]/50 hover:text-[#2B3B2E] text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Kitap Başlığı */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Kitap Başlığı *
            </label>
            <input
              type="text"
              placeholder="Kitap adını girin..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] focus:outline-none focus:border-[#A06A42]"
            />
          </div>

          {/* Açıklama */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Açıklama *
            </label>
            <textarea
              rows={3}
              placeholder="Kitap açıklamasını girin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] focus:outline-none focus:border-[#A06A42] resize-none"
            />
          </div>

          {/* Kategoriler (Maksimum 2 Seçim) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
                Kategoriler (Maks. {MAX_CATEGORIES}) *
              </label>
              <span className="text-[11px] font-bold text-[#A06A42]">
                {categoryIds.length} / {MAX_CATEGORIES} seçildi
              </span>
            </div>

            {loadingCategories ? (
              <div className="text-xs text-[#2B3B2E]/50 py-2">Kategoriler yükleniyor...</div>
            ) : categories.length === 0 ? (
              <div className="text-xs text-[#2B3B2E]/50 py-2">Kategori bulunamadı.</div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                {categories.map((cat) => {
                  const strId = String(cat.id);
                  const isSelected = categoryIds.includes(strId);
                  const isLimitReached = !isSelected && categoryIds.length >= MAX_CATEGORIES;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={isLimitReached}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#A06A42] text-[#FFFDFB] border-[#A06A42] cursor-pointer'
                          : isLimitReached
                          ? 'bg-[#FFFDFB]/50 text-[#2B3B2E]/30 border-[#EADFCF]/50 cursor-not-allowed'
                          : 'bg-[#FFFDFB] text-[#2B3B2E]/80 border-[#EADFCF] hover:border-[#A06A42] cursor-pointer'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kapak Görseli */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              Kapak Görseli *
            </label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-20 rounded-xl overflow-hidden border border-[#EADFCF] bg-[#FAF6F0] shrink-0 flex items-center justify-center">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Kapak Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="book" size={18} />
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

          {/* PDF Dosyası */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
              PDF Dosyası *
            </label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePdfChange}
              className="block w-full text-xs text-[#2B3B2E]/70 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border file:border-[#EADFCF] file:text-xs file:font-black file:uppercase file:bg-[#FAF6F0] file:text-[#2B3B2E] hover:file:bg-[#A06A42] hover:file:text-[#FFFDFB] file:transition-all file:cursor-pointer"
            />
            {pdf && (
              <p className="text-[11px] text-[#A06A42] font-bold">
                Seçilen PDF: {pdf.name}
              </p>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EADFCF]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-[#EADFCF] text-[#2B3B2E] hover:bg-[#FAF6F0] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-[#A06A42] hover:bg-[#A06A42]/90 text-[#FFFDFB] text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Yükleniyor...' : 'Kitap Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateBookModal;
