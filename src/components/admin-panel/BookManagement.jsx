import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';
import Loading from '../common/Loading';
import NotFound from '../common/NotFound';
import ConfirmModal from '../common/ConfirmModal';
import { AdminApi } from '../../api/adminApi';
import { FILEBASE_URL } from '../../api/api';
const PAGE_LIMIT = 10;

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });

  const [modalAction, setModalAction] = useState({ type: null, book: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBooks = useCallback(async (page = 1, searchQuery = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await AdminApi.getAllBooks(page, PAGE_LIMIT, searchQuery);

      if (data) {
        setBooks(data.books || []);
        setPagination({
          totalItems: Number(data.totalItems ?? 0),
          totalPages: Number(data.totalPages ?? 1),
          currentPage: Number(data.currentPage ?? page)
        });
      }
    } catch (err) {
      console.error("Kitaplar çekilirken hata oluştu:", err);
      setError("Kitap listesi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(1, debouncedSearch);
  }, [debouncedSearch, fetchBooks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      fetchBooks(newPage, debouncedSearch);
    }
  };

  const getFullUrl = (path) => {
    if (!path) return "";
    return path.startsWith('http') ? path : `${FILEBASE_URL}${path}`;
  };

  const handleDownload = (book) => {
    if (!book.filePath) {
      alert("Bu kitaba ait PDF dosyası bulunamadı.");
      return;
    }

    const pdfUrl = getFullUrl(book.filePath);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.setAttribute('download', `${book.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openActionModal = (type, book) => {
    setActionError("");
    setModalAction({ type, book });
  };

  const closeActionModal = () => {
    if (actionLoading) return;
    setModalAction({ type: null, book: null });
    setActionError("");
  };

  const handleConfirmAction = async () => {
    const { type, book } = modalAction;
    if (!type || !book) return;

    setActionLoading(true);
    setActionError("");

    try {
      if (type === 'delete') {
        await AdminApi.deleteBook(book.id);
        const isLastItemOnPage = books.length === 1 && pagination.currentPage > 1;
        const targetPage = isLastItemOnPage ? pagination.currentPage - 1 : pagination.currentPage;
        setModalAction({ type: null, book: null });
        await fetchBooks(targetPage, debouncedSearch);
      } else if (type === 'verify') {
        await AdminApi.verifyBook(book.id);
        setModalAction({ type: null, book: null });
        await fetchBooks(pagination.currentPage, debouncedSearch);
      } else if (type === 'unverify') {
        await AdminApi.unverifyBook(book.id);
        setModalAction({ type: null, book: null });
        await fetchBooks(pagination.currentPage, debouncedSearch);
      }
    } catch (err) {
      console.error("İşlem sırasında hata oluştu:", err);
      setActionError(
        err.response?.data?.message || "İşlem gerçekleştirilirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getModalConfig = () => {
    const { type, book } = modalAction;
    if (!book) return {};

    if (type === 'verify') {
      return {
        title: "Kitabı Onayla",
        highlightText: book.title,
        message: "adlı kitabı doğrulamak istediğinize emin misiniz? Onaylandığında kütüphanede yayına alınacaktır.",
        confirmText: "Evet, Kitabı Onayla",
        loadingText: "Onaylanıyor...",
        variant: "success"
      };
    }
    if (type === 'unverify') {
      return {
        title: "Kitap Onayını Kaldır",
        highlightText: book.title,
        message: "adlı kitabın doğrulamasını kaldırmak istediğinize emin misiniz? Kitap onay bekleyenler durumuna geçecektir.",
        confirmText: "Evet, Onayı Kaldır",
        loadingText: "Güncelleniyor...",
        variant: "warning"
      };
    }
    return {
      title: "Kitabı Sil",
      highlightText: book.title,
      message: "adlı kitabı ve PDF dosyasını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
      confirmText: "Evet, Kitabı Sil",
      loadingText: "Siliniyor...",
      variant: "danger"
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const modalConfig = getModalConfig();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#FFFDFB] p-6 rounded-2xl border border-[#EADFCF] shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EADFCF] text-[#A06A42] text-[11px] font-black uppercase tracking-wider">
            <Icon name="sparkles" size={13} variant="primary" />
            <span>Arşiv Kontrolü</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#2B3B2E] tracking-tight">
            Kitap Yönetimi
          </h2>
          <p className="text-xs md:text-sm text-[#2B3B2E]/70 font-medium">
            Yüklenen kitap PDF'lerini inceleyin, doğrulama durumlarını yönetin veya arşivden kaldırın.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitap adı veya açıklama ara..."
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
          <Loading key="book-list-loader" message="Kitap verileri getiriliyor..." />
        )}

        {!loading && error && (
          <NotFound
            key="book-list-error"
            icon="alert"
            title="Bağlantı Hatası"
            message={error}
            actionText="Tekrar Dene"
            onAction={() => fetchBooks(pagination.currentPage, debouncedSearch)}
          />
        )}

        {!loading && !error && (
          <motion.div
            key={`book-table-${debouncedSearch}-${pagination.currentPage}`}
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
                    ? `Tüm Kitaplar (${pagination.totalItems})` 
                    : `Arama Sonuçları (${pagination.totalItems})`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#2B3B2E]/60">
                Sayfa {pagination.currentPage} / {pagination.totalPages}
              </span>
            </div>

            {books.length > 0 ? (
              <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#EADFCF] bg-[#FAF6F0]/70 text-[11px] font-black text-[#A06A42] uppercase tracking-wider">
                        <th className="py-4 px-5">Kitap Bilgisi</th>
                        <th className="py-4 px-4">Kategoriler</th>
                        <th className="py-4 px-4">Yükleyen</th>
                        <th className="py-4 px-4 text-center">Onay Durumu</th>
                        <th className="py-4 px-4">Eklenme Tarihi</th>
                        <th className="py-4 px-5 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADFCF]/60 text-xs md:text-sm text-[#2B3B2E]">
                      {books.map((book) => (
                        <tr 
                          key={book.id} 
                          className="hover:bg-[#FAF6F0]/50 transition-colors duration-150 group"
                        >
                          <td className="py-3.5 px-5 max-w-xs">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-14 rounded-lg bg-[#FAF6F0] border border-[#EADFCF] overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                                {book.coverImage ? (
                                  <img
                                    src={getFullUrl(book.coverImage)}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="text-[10px] font-black text-[#A06A42]">PDF</span>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-black text-[#2B3B2E] truncate" title={book.title}>
                                  {book.title}
                                </span>
                                <span className="text-[11px] text-[#2B3B2E]/60 font-medium line-clamp-1" title={book.description}>
                                  {book.description || "Açıklama belirtilmemiş"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {book.categories && book.categories.length > 0 ? (
                                book.categories.map((cat) => (
                                  <span
                                    key={cat.id}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF6F0] text-[#A06A42] border border-[#EADFCF]"
                                  >
                                    {cat.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-[#2B3B2E]/40 font-semibold italic">
                                  Kategorisiz
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {book.uploader ? (
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#FAF6F0] border border-[#EADFCF]">
                                <span className="w-4 h-4 rounded-md bg-[#A06A42]/15 text-[#A06A42] flex items-center justify-center text-[10px] font-black uppercase">
                                  {book.uploader.username?.charAt(0) || "U"}
                                </span>
                                <span className="text-xs font-bold text-[#2B3B2E]">
                                  {book.uploader.username}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-[#2B3B2E]/40">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center gap-1">
                              {book.isVerified ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  Onaylı
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  Onay Bekliyor
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-[#2B3B2E]/75">
                            {formatDate(book.createdAt)}
                          </td>

                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDownload(book)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#A06A42] text-[#2B3B2E] hover:text-[#FFFDFB] border border-[#EADFCF] hover:border-[#A06A42] text-xs font-bold transition-all duration-150 cursor-pointer"
                                title="PDF Dosyasını İndir / İncele"
                              >
                                <Icon name="download" size={14} />
                                <span>PDF</span>
                              </button>

                              {book.isVerified ? (
                                <button
                                  type="button"
                                  onClick={() => openActionModal('unverify', book)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-[#FFFDFB] border border-amber-200 hover:border-amber-600 text-xs font-bold transition-all duration-150 cursor-pointer"
                                  title="Kitap Onayını Kaldır"
                                >
                                  <span>Onayı Kaldır</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openActionModal('verify', book)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-[#FFFDFB] border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all duration-150 cursor-pointer"
                                  title="Kitabı Onayla"
                                >
                                  <span>Onayla</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => openActionModal('delete', book)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-[#FFFDFB] border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all duration-150 cursor-pointer"
                                title="Kitabı Sil"
                              >
                                <Icon name="trash" size={14} />
                                <span>Sil</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF6F0]/40 border-t border-[#EADFCF]">
                    <span className="text-[11px] font-bold text-[#2B3B2E]/60">
                      Toplam <strong className="text-[#2B3B2E]">{pagination.totalItems}</strong> kitaptan{' '}
                      <strong className="text-[#2B3B2E]">{books.length}</strong> tanesi gösteriliyor
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
                key="empty-books"
                icon="search"
                title="Kitap Bulunamadı"
                message={
                  debouncedSearch
                    ? `"${debouncedSearch}" aramasıyla eşleşen bir kitap bulunamadı.`
                    : "Sistemde henüz yüklü kitap bulunmuyor."
                }
                actionText={search ? "Aramayı Temizle" : undefined}
                onAction={search ? () => setSearch("") : undefined}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={Boolean(modalAction.book)}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        highlightText={modalConfig.highlightText}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        loadingText={modalConfig.loadingText}
        variant={modalConfig.variant}
        cancelText="Vazgeç"
        loading={actionLoading}
        error={actionError}
      />
    </div>
  );
};

export default BookManagement;
