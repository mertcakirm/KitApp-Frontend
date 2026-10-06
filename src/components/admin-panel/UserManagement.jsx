import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';
import Loading from '../common/Loading';
import NotFound from '../common/NotFound';
import ConfirmModal from '../common/ConfirmModal';
import { AdminApi } from '../../api/adminApi';

const PAGE_LIMIT = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async (page = 1, searchQuery = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await AdminApi.getAllUsers(page, PAGE_LIMIT, searchQuery);

      if (data) {
        setUsers(data.users || []);
        setPagination({
          totalItems: Number(data.totalItems ?? 0),
          totalPages: Number(data.totalPages ?? 1),
          currentPage: Number(data.currentPage ?? page)
        });
      }
    } catch (err) {
      console.error("Kullanıcılar çekilirken hata oluştu:", err);
      setError("Kullanıcı listesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, debouncedSearch);
  }, [debouncedSearch, fetchUsers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      fetchUsers(newPage, debouncedSearch);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteError("");
    setUserToDelete(user);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setUserToDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await AdminApi.deleteUser(userToDelete.id);

      const isLastItemOnPage = users.length === 1 && pagination.currentPage > 1;
      const targetPage = isLastItemOnPage ? pagination.currentPage - 1 : pagination.currentPage;

      setUserToDelete(null);
      await fetchUsers(targetPage, debouncedSearch);
    } catch (err) {
      console.error("Kullanıcı silinirken hata oluştu:", err);
      setDeleteError(
        err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleBadge = (roleName) => {
    const role = roleName?.toLowerCase();
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#A06A42]/15 text-[#A06A42] border border-[#A06A42]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A06A42]" />
          Yönetici (Admin)
        </span>
      );
    }
    if (role === 'writer') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#2B3B2E]/10 text-[#2B3B2E] border border-[#2B3B2E]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B3B2E]" />
          Yazar (Writer)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FAF6F0] text-[#2B3B2E]/70 border border-[#EADFCF]">
        {roleName || 'Kullanıcı'}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#FFFDFB] p-6 rounded-2xl border border-[#EADFCF] shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EADFCF] text-[#A06A42] text-[11px] font-black uppercase tracking-wider">
            <Icon name="shield" size={13} variant="primary" />
            <span>Yönetim Paneli</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#2B3B2E] tracking-tight">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-xs md:text-sm text-[#2B3B2E]/70 font-medium">
            Sistemdeki kayıtlı kullanıcıları, rollerini ve yükledikleri kitap sayılarını inceleyin.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kullanıcı adı veya e-posta ara..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-xs font-bold text-[#2B3B2E] placeholder-[#2B3B2E]/40 focus:outline-none focus:border-[#A06A42] transition-colors"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A06A42]">
            <Icon name="search" size={15} />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B3B2E]/40 hover:text-[#2B3B2E] transition-colors text-xs font-black cursor-pointer"
              title="Aramayı Temizle"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <Loading key="user-list-loader" message="Kullanıcı verileri getiriliyor..." />
        )}

        {!loading && error && (
          <NotFound
            key="user-list-error"
            icon="alert"
            title="Bağlantı Hatası"
            message={error}
            actionText="Tekrar Dene"
            onAction={() => fetchUsers(pagination.currentPage, debouncedSearch)}
          />
        )}

        {!loading && !error && (
          <motion.div
            key={`user-table-${debouncedSearch}-${pagination.currentPage}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b-2 border-[#EADFCF] pb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-black text-[#A06A42] uppercase tracking-wider">
                <Icon name="sparkles" size={14} variant="primary" pulse />
                <span>
                  {debouncedSearch.trim() === "" 
                    ? `Tüm Kullanıcılar (${pagination.totalItems})` 
                    : `Arama Sonuçları (${pagination.totalItems})`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#2B3B2E]/60">
                Sayfa {pagination.currentPage} / {pagination.totalPages}
              </span>
            </div>

            {users.length > 0 ? (
              <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EADFCF] bg-[#FAF6F0]/70 text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                        <th className="py-4 px-5">Kullanıcı</th>
                        <th className="py-4 px-4">Rol</th>
                        <th className="py-4 px-4 text-center">Kitap Sayısı</th>
                        <th className="py-4 px-4 text-center">Durum</th>
                        <th className="py-4 px-4">Kayıt Tarihi</th>
                        <th className="py-4 px-4">Son Güncelleme</th>
                        <th className="py-4 px-5 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADFCF]/60 text-xs md:text-sm text-[#2B3B2E]">
                      {users.map((user) => (
                        <tr 
                          key={user.id} 
                          className="hover:bg-[#FAF6F0]/50 transition-colors duration-150 group"
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] flex items-center justify-center text-[#A06A42] font-black text-sm uppercase shrink-0 group-hover:bg-[#A06A42] group-hover:text-[#FFFDFB] transition-colors">
                                {user.username ? user.username.charAt(0) : "U"}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-[#2B3B2E] leading-tight">
                                  {user.username}
                                </span>
                                <span className="text-[11px] text-[#2B3B2E]/60 font-medium">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getRoleBadge(user.role?.name)}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#EADFCF] font-black text-xs text-[#2B3B2E]">
                              {user.bookCount ?? 0}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {user.isActive ? (
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

                          <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-[#2B3B2E]/75">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-[#2B3B2E]/60">
                            {formatDate(user.updatedAt)}
                          </td>

                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            {user.isActive ? (
                              <button
                                type="button"
                                onClick={() => openDeleteModal(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-[#FFFDFB] border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all duration-150 cursor-pointer"
                                title="Kullanıcıyı Sil"
                              >
                                <Icon name="trash" size={14} />
                                <span>Pasif Yap</span>
                              </button>
                            ) : (
                              <span className="text-[#2B3B2E]/30 text-xs font-bold">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF6F0]/40 border-t border-[#EADFCF]">
                    <span className="text-[11px] font-bold text-[#2B3B2E]/60">
                      Toplam <strong className="text-[#2B3B2E]">{pagination.totalItems}</strong> kullanıcıdan{' '}
                      <strong className="text-[#2B3B2E]">{users.length}</strong> tanesi gösteriliyor
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage <= 1}
                        className="px-3 py-1.5 rounded-lg border border-[#EADFCF] bg-[#FFFDFB] text-xs font-bold text-[#2B3B2E] hover:border-[#A06A42] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        Önceki
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                            pageNum === pagination.currentPage
                              ? 'bg-[#A06A42] text-[#FFFDFB]'
                              : 'bg-[#FFFDFB] border border-[#EADFCF] text-[#2B3B2E] hover:border-[#A06A42]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className="px-3 py-1.5 rounded-lg border border-[#EADFCF] bg-[#FFFDFB] text-xs font-bold text-[#2B3B2E] hover:border-[#A06A42] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        Sonraki
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NotFound
                key="empty-users"
                icon="search"
                title="Kullanıcı Bulunamadı"
                message={
                  debouncedSearch
                    ? `"${debouncedSearch}" aramasıyla eşleşen bir kullanıcı bulunamadı.`
                    : "Sistemde henüz kayıtlı kullanıcı bulunmuyor."
                }
                actionText={search ? "Aramayı Temizle" : undefined}
                onAction={search ? () => setSearch("") : undefined}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Kullanıcıyı Sil"
        highlightText={userToDelete?.username}
        message="adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Kullanıcıyı Sil"
        cancelText="Vazgeç"
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default UserManagement;
