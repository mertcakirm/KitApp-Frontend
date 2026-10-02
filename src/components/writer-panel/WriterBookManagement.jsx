import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../common/Icon';
import ConfirmModal from '../common/ConfirmModal';
import CreateBookModal from './CreateBookModal';
import { BookApi } from '../../api/bookApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WriterBookManagement = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Kitap Ekleme Modalı State'i
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Güncelleme Modalı State'leri
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Silme Modalı State'leri
  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchWriterBooks();
    }
  }, [userId, page, search]);

  const fetchWriterBooks = async () => {
    try {
      setLoading(true);
      const response = await BookApi.getByWriter(userId, page, limit, search);
      const result = response?.data || response;

      setBooks(result?.books || []);
      setTotalPages(result?.totalPages || 1);
      setTotalItems(result?.totalItems || 0);
    } catch (error) {
      console.error('Yazar kitapları getirilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Arama Formu Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  // Tam Dosya URL'si Oluşturucu (/uploads/... -> http://localhost:5000/uploads/...)
  const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  // PDF İndirme Fonksiyonu
  const handleDownloadPdf = async (book) => {
    if (!book?.filePath) return;
    const fileUrl = getFileUrl(book.filePath);

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${book.title || 'kitap'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Güncelleme Modalını Aç
  const openEditModal = (book) => {
    setEditingBook(book);
    setEditTitle(book.title || '');
    setEditDescription(book.description || '');
    setEditCoverFile(null);
    setEditCoverPreview(getFileUrl(book.coverImage));
  };

  const closeEditModal = () => {
    setEditingBook(null);
    setEditTitle('');
    setEditDescription('');
    setEditCoverFile(null);
    setEditCoverPreview('');
  };

  // Kapak Resmi Seçildiğinde Önizleme Oluştur
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditCoverFile(file);
      setEditCoverPreview(URL.createObjectURL(file));
    }
  };

  // Kitap Güncelleme İşlemi (FormData ile coverImage, title, description)
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      formData.append('description', editDescription.trim());
      if (editCoverFile) {
        formData.append('coverImage', editCoverFile);
      }

      await BookApi.updateBook(editingBook.id, formData);

      closeEditModal();
      fetchWriterBooks();
    } catch (error) {
      console.error('Kitap güncellenirken hata oluştu:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Kitap Silme İşlemi
  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    try {
      setIsDeleting(true);
      await BookApi.deleteBook(deletingBook.id);
      setDeletingBook(null);

      if (books.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchWriterBooks();
      }
    } catch (error) {
      console.error('Kitap silinirken hata oluştu:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Üst Bar: Başlık, Arama ve Kitap Ekle Butonu */}
      <div className="p-5 bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#2B3B2E] uppercase tracking-wider flex items-center gap-2">
            <Icon name="book" size={18} />
            <span>Kitaplarım</span>
            <span className="ml-1 px-2.5 py-0.5 text-xs rounded-lg bg-[#FAF6F0] border border-[#EADFCF] text-[#A06A42]">
              {totalItems}
            </span>
          </h2>
          <p className="text-xs text-[#2B3B2E]/60 mt-0.5">
            Yüklediğiniz kitapları görüntüleyebilir, düzenleyebilir veya indirebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Arama Kutusu */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Kitap adı veya açıklama ara..."
                className="w-full pl-3.5 pr-9 py-2 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] placeholder-[#2B3B2E]/40 focus:outline-none focus:border-[#A06A42]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2B3B2E]/40 hover:text-[#2B3B2E] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADFCF]/60 text-[#2B3B2E] border border-[#EADFCF] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Ara
            </button>
          </form>

          {/* Kitap Ekle Butonu */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A06A42] hover:bg-[#A06A42]/90 text-[#FFFDFB] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <Icon name="plus" size={14} />
            <span>Kitap Ekle</span>
          </button>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EADFCF] bg-[#FAF6F0]/60 text-[11px] font-black uppercase tracking-wider text-[#2B3B2E]/70">
                <th className="py-3.5 px-4">Kapak</th>
                <th className="py-3.5 px-4">Kitap Bilgisi</th>
                <th className="py-3.5 px-4">Kategoriler</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4">Tarih</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFCF]/60 text-xs text-[#2B3B2E]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#2B3B2E]/60 font-medium">
                    Kitaplar yükleniyor...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#2B3B2E]/60 font-medium">
                    Henüz hiç kitap bulunamadı.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    {/* Kapak Görseli */}
                    <td className="py-3 px-4 w-16">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-[#EADFCF] bg-[#FAF6F0] flex items-center justify-center shrink-0">
                        {book.coverImage ? (
                          <img
                            src={getFileUrl(book.coverImage)}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon name="book" size={16} />
                        )}
                      </div>
                    </td>

                    {/* Başlık ve Açıklama */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-black text-sm text-[#2B3B2E] truncate">
                        {book.title}
                      </div>
                      <div className="text-[#2B3B2E]/70 line-clamp-2 mt-0.5 text-xs">
                        {book.description || 'Açıklama yok'}
                      </div>
                    </td>

                    {/* Kategoriler */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {book.categories && book.categories.length > 0 ? (
                          book.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#EADFCF] text-[11px] font-bold text-[#A06A42]"
                            >
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#2B3B2E]/40 text-[11px]">Kategorisiz</span>
                        )}
                      </div>
                    </td>

                    {/* Onay Durumu */}
                    <td className="py-3 px-4">
                      {book.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black uppercase tracking-wider">
                          Onaylı
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black uppercase tracking-wider">
                          Onay Bekliyor
                        </span>
                      )}
                    </td>

                    {/* Oluşturulma Tarihi */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#2B3B2E]/70 font-medium">
                      {formatDate(book.createdAt)}
                    </td>

                    {/* Aksiyon Butonları: PDF İndir, Güncelle, Sil */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        {book.filePath && (
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(book)}
                            title="PDF İndir"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#2B3B2E] text-[#2B3B2E] hover:text-[#FFFDFB] border border-[#EADFCF] text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <Icon name="download" size={13} />
                            <span>PDF</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(book)}
                          title="Düzenle"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#A06A42] text-[#A06A42] hover:text-[#FFFDFB] border border-[#EADFCF] hover:border-[#A06A42] text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Icon name="edit" size={13} />
                          <span>Güncelle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingBook(book)}
                          title="Sil"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F0] hover:bg-rose-600 text-rose-600 hover:text-[#FFFDFB] border border-[#EADFCF] hover:border-rose-600 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Icon name="trash" size={13} />
                          <span>Sil</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama (Pagination) */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-[#EADFCF] bg-[#FAF6F0]/40 flex items-center justify-between text-xs">
            <span className="text-[#2B3B2E]/70 font-medium">
              Sayfa <strong>{page}</strong> / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#EADFCF] bg-[#FFFDFB] hover:bg-[#FAF6F0] disabled:opacity-40 font-bold cursor-pointer"
              >
                Önceki
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#EADFCF] bg-[#FFFDFB] hover:bg-[#FAF6F0] disabled:opacity-40 font-bold cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateBookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setPage(1);
          fetchWriterBooks();
        }}
      />

      {/* Güncelleme Modalı (Sadece coverImage, title ve description) */}
      {editingBook &&
        createPortal(
          <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#EADFCF] pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#2B3B2E]">
                  Kitap Bilgilerini Güncelle
                </h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-[#2B3B2E]/50 hover:text-[#2B3B2E] text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateBook} className="space-y-4">
                {/* Kapak Görseli Güncelleme */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#2B3B2E]/80">
                    Kapak Görseli
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-22 rounded-xl overflow-hidden border border-[#EADFCF] bg-[#FAF6F0] shrink-0 flex items-center justify-center">
                      {editCoverPreview ? (
                        <img
                          src={editCoverPreview}
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
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
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
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-[#2B3B2E] focus:outline-none focus:border-[#A06A42] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EADFCF]">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={closeEditModal}
                    className="px-4 py-2.5 rounded-xl border border-[#EADFCF] text-[#2B3B2E] hover:bg-[#FAF6F0] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl bg-[#A06A42] hover:bg-[#A06A42]/90 text-[#FFFDFB] text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      <ConfirmModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteBook}
        title="Kitabı Sil"
        message={`"${deletingBook?.title}" adlı kitabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        loading={isDeleting}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default WriterBookManagement;
