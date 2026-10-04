import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';
import Loading from '../common/Loading';
import NotFound from '../common/NotFound';
import ConfirmModal from '../common/ConfirmModal';
import { CategoryApi } from '../../api/categoryApi';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await CategoryApi.getAll();

      if (data) {
        const list = data.rows || [];
        setCategories(list);
        setTotalCount(Number(data.count ?? list.length));
      }
    } catch (err) {
      console.error("Kategoriler çekilirken hata oluştu:", err);
      setError("Kategori listesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async () => {
    if (createLoading) return;
    setCreateError("");
    setCreateSuccess("");

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setCreateError("Lütfen bir kategori adı girin.");
      return;
    }

    setCreateLoading(true);

    try {
      await CategoryApi.create(trimmedName);
      setNewCategoryName("");
      setCreateSuccess(`"${trimmedName}" kategorisi başarıyla eklendi.`);
      await fetchCategories();

      setTimeout(() => {
        setCreateSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Kategori eklenirken hata oluştu:", err);
      setCreateError(
        err.response?.data?.message || "Kategori eklenirken bir hata oluştu."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateCategory();
    }
  };

  const openDeleteModal = (category) => {
    setDeleteError("");
    setCategoryToDelete(category);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setCategoryToDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await CategoryApi.delete(categoryToDelete.id);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err) {
      console.error("Kategori silinirken hata oluştu:", err);
      setDeleteError(
        err.response?.data?.message || "Kategori silinirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#EADFCF] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EADFCF] text-[#A06A42] text-[11px] font-black uppercase tracking-wider">
              <Icon name="sparkles" size={13} variant="primary" />
              <span>Katalog Yapısı</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#2B3B2E] tracking-tight">
              Kategori Yönetimi
            </h2>
            <p className="text-xs md:text-sm text-[#2B3B2E]/70 font-medium">
              Kitapların sınıflandırıldığı kategorileri inceleyin, yeni kategori ekleyin veya kaldırın.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={handleCreateKeyDown}
              disabled={createLoading}
              placeholder="Yeni kategori adı..."
              className="w-full sm:w-64 px-4 py-2.5 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-xs font-bold text-[#2B3B2E] placeholder-[#2B3B2E]/40 focus:outline-none focus:border-[#A06A42] transition-colors"
            />

            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={createLoading}
              className="px-4 py-2.5 rounded-xl bg-[#A06A42] hover:bg-[#8B5A36] text-[#FFFDFB] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              {createLoading ? (
                <>
                  <Icon name="loader" size={14} spin />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={14} />
                  <span>Kategori Ekle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {createError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <Icon name="alert" size={14} />
            <span>{createError}</span>
          </div>
        )}

        {createSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Icon name="sparkles" size={14} />
            <span>{createSuccess}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <Loading key="category-loader" message="Kategoriler getiriliyor..." />
        )}

        {!loading && error && (
          <NotFound
            key="category-error"
            icon="alert"
            title="Bağlantı Hatası"
            message={error}
            actionText="Tekrar Dene"
            onAction={fetchCategories}
          />
        )}

        {!loading && !error && (
          <motion.div
            key="category-table-content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b-2 border-[#EADFCF] pb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-black text-[#A06A42] uppercase tracking-wider">
                <Icon name="sparkles" size={14} variant="primary" pulse />
                <span>Tüm Kategoriler ({totalCount})</span>
              </div>
            </div>

            {categories.length > 0 ? (
              <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EADFCF] bg-[#FAF6F0]/70 text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                        <th className="py-4 px-5">Kategori Adı</th>
                        <th className="py-4 px-4 text-center">Durum</th>
                        <th className="py-4 px-5 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADFCF]/60 text-xs md:text-sm text-[#2B3B2E]">
                      {categories.map((cat) => (
                        <tr 
                          key={cat.id} 
                          className="hover:bg-[#FAF6F0]/50 transition-colors duration-150 group"
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center text-[#A06A42] font-black text-xs uppercase shrink-0 group-hover:bg-[#A06A42] group-hover:text-[#FFFDFB] transition-colors">
                                {cat.name ? cat.name.charAt(0) : "#"}
                              </div>
                              <span className="font-black text-[#2B3B2E]">
                                {cat.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {cat.isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Pasif
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openDeleteModal(cat)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-[#FFFDFB] border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all duration-150 cursor-pointer"
                              title="Kategoriyi Sil"
                            >
                              <Icon name="trash" size={14} />
                              <span>Sil</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <NotFound
                key="empty-categories"
                icon="sparkles"
                title="Kategori Bulunamadı"
                message="Sistemde henüz kayıtlı kategori bulunmuyor. Üstteki alandan yeni bir kategori ekleyebilirsiniz."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Kategoriyi Sil"
        highlightText={categoryToDelete?.name}
        message="adlı kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Kategoriyi Sil"
        loadingText="Siliniyor..."
        variant="danger"
        cancelText="Vazgeç"
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default CategoryManagement;
