import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/common/Icon';
import PageHeader from '../components/Home/PageHeader';
import SearchBar from '../components/Home/SearchBar';
import BookCard from '../components/Home/BookCard';
import BookDetailModal from '../components/Home/BookDetailModal';
import { BookApi } from '../api/bookApi';
import Loading from '../components/common/Loading';
import NotFound from '../components/common/NotFound';

const API_BASE_URL = 'http://localhost:5000';
const PAGE_LIMIT = 12;

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });

  const observerTarget = useRef(null);

  const fetchBooks = useCallback(async (page = 1, searchQuery = "", isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const data = await BookApi.getAll(page, PAGE_LIMIT, searchQuery);

      if (data) {
        const fetchedBooks = data.books || [];

        setBooks((prevBooks) => {
          if (!isAppend) return fetchedBooks;
          const existingIds = new Set(prevBooks.map((b) => b.id));
          const uniqueNewBooks = fetchedBooks.filter((b) => !existingIds.has(b.id));
          return [...prevBooks, ...uniqueNewBooks];
        });

        setPagination({
          totalItems: data.totalItems || 0,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || page
        });
      }
    } catch (err) {
      console.error("Kitaplar çekilirken hata oluştu:", err);
      if (!isAppend) {
        setError("Arşiv yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(1, search, false);
  }, [search, fetchBooks]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const hasMore = pagination.currentPage < pagination.totalPages;

        if (entry.isIntersecting && hasMore && !loading && !loadingMore && !error) {
          fetchBooks(pagination.currentPage + 1, search, true);
        }
      },
      {
        root: null,
        rootMargin: '150px',
        threshold: 0.1,
      }
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [pagination.currentPage, pagination.totalPages, loading, loadingMore, error, search, fetchBooks]);

  const handleDownload = (book) => {
    if (!book.filePath) {
      alert("Bu kitaba ait PDF dosyası bulunamadı.");
      return;
    }

    const pdfUrl = book.filePath.startsWith('http')
      ? book.filePath
      : `${API_BASE_URL}${book.filePath}`;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.setAttribute('download', `${book.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      
      <PageHeader 
        badgeText="Zengin PDF Kütüphanesi"
        title="Kitapların PDF’lerine"
        subtitle="Sadece indirme amaçlı kütüphanemizden dilediğiniz kitapların PDF’lerini indirin, kendi çevrimdışı arşivinizi oluşturun."
      />

      <SearchBar 
        value={search} 
        onChange={setSearch} 
        onPopularClick={setSearch} 
      />

      <div className="w-full max-w-6xl pb-12">
        <AnimatePresence mode="wait">
          {loading && (
            <Loading key="main-loader" message="PDF arşivinden kitaplar getiriliyor..." />
          )}

          {!loading && error && (
            <NotFound 
              key="error-state"
              icon="alert"
              title="Bağlantı Hatası"
              message={error} 
              actionText="Tekrar Dene"
              onAction={() => fetchBooks(1, search, false)}
            />
          )}

          {!loading && !error && (
            <motion.div
              key={`results-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b-2 border-[#EADFCF] pb-3 pl-1">
                <div className="flex items-center gap-2 text-xs font-black text-[#A06A42] uppercase tracking-wider">
                  <Icon name="sparkles" size={14} variant="primary" pulse />
                  <span>
                    {search.trim() === "" ? "Tüm Kitap PDF Arşivi" : `Arama Sonuçları (${pagination.totalItems})`}
                  </span>
                </div>
              </div>
              
              {books.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {books.map((book, index) => (
                      <BookCard 
                        key={book.id} 
                        index={index % PAGE_LIMIT}
                        book={book} 
                        onDownload={handleDownload} 
                        onDetailClick={setSelectedBook}
                      />
                    ))}
                  </div>

                  {/* SCROLL TETİKLEYİCİ VE ALT YÜKLENİYOR GÖSTERGESİ */}
                  <div ref={observerTarget} className="w-full py-6 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      {loadingMore && (
                        <motion.div
                          key="loading-more"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2.5 text-[#A06A42] bg-[#FFFDFB] border border-[#EADFCF] px-4 py-2 rounded-full shadow-xs"
                        >
                          <Icon name="loader" size={16} spin variant="primary" />
                          <span className="text-xs font-bold text-[#2B3B2E]">Daha fazla kitap yükleniyor...</span>
                        </motion.div>
                      )}

                      {!loadingMore && pagination.currentPage >= pagination.totalPages && pagination.totalPages > 1 && (
                        <motion.div
                          key="end-of-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] font-bold text-[#2B3B2E]/50 pt-2"
                        >
                          Tüm arşiv listelendi ({books.length} kitap)
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <NotFound
                  key="empty-search"
                  icon="search"
                  title="Kitap Bulunamadı"
                  message={`"${search}" aramasıyla eşleşen bir kitap PDF'i bulunamadı.`}
                  actionText={search ? "Aramayı Temizle" : undefined}
                  onAction={search ? () => setSearch("") : undefined}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BookDetailModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
        onDownload={handleDownload}
      />

    </div>
  );
};

export default Home;
