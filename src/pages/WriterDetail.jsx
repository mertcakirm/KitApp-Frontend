import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/common/Icon';
import Loading from '../components/common/Loading';
import NotFound from '../components/common/NotFound';
import BookCard from '../components/Home/BookCard';
import BookDetailModal from '../components/Home/BookDetailModal';
import { BookApi } from '../api/bookApi';

const API_BASE_URL = 'http://localhost:5000';

const WriterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedWriter = location.state?.writer || null;
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const writerName = books[0]?.uploader?.username || passedWriter?.username || 'Yazar';
  const writerInitials = writerName.slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchWriterBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await BookApi.getByWriter(id, currentPage);
        const result = response?.data?.data || response?.data || response;
        setBooks(result?.books || []);
        setTotalItems(result?.totalItems ?? (result?.books?.length || 0));
        setTotalPages(result?.totalPages || 1);
      } catch (err) {
        console.error('Yazarın kitapları yüklenirken hata oluştu:', err);
        setError('Yazar profili ve eserleri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWriterBooks();
    }
  }, [id, currentPage]);

  const profileStats = useMemo(() => {
    const verifiedCount = books.filter((b) => b.isVerified).length;
    const categoryMap = new Map();

    books.forEach((book) => {
      book.categories?.forEach((cat) => {
        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, cat.name);
        }
      });
    });
    const uniqueCategories = Array.from(categoryMap, ([catId, name]) => ({ id: catId, name }));
    return {
      verifiedCount,
      uniqueCategories,
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch =
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .map((book) => ({
        ...book,
        uploader: book.uploader || { username: writerName },
        isActive: book.isActive ?? book.isVerified,
      }));
  }, [books, searchQuery, writerName]);

  const handleDownload = (book) => {
    if (!book?.filePath) return;
    const pdfUrl = book.filePath.startsWith('http')
      ? book.filePath
      : `${API_BASE_URL}${book.filePath}`;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDetailClick = (book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      <div className="w-full max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#2B3B2E] hover:text-[#A06A42] bg-[#FFFDFB] border-2 border-[#EADFCF] hover:border-[#A06A42]/50 px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Icon name="arrowLeft" size={16} />
            <span>Yazarlara Dön</span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Loading key="loading" message="Yazar profili ve eserleri yükleniyor..." />
          ) : error ? (
            <NotFound
              key="error"
              icon="alertTriangle"
              title="Bir Sorun Oluştu"
              message={error}
              actionText="Tekrar Dene"
              onAction={() => setCurrentPage(1)}
            />
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="bg-[#FFFDFB] border-2 border-[#EADFCF] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FAF6F0] border-2 border-[#A06A42]/30 flex items-center justify-center text-2xl sm:text-3xl font-black text-[#A06A42] shrink-0 shadow-inner">
                      {writerInitials}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-[#A06A42]/10 border border-[#A06A42]/20 text-[#A06A42] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Yazar Profili
                        </span>
                        {passedWriter?.email && (
                          <span className="text-xs font-bold text-[#2B3B2E]/60 bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#EADFCF]">
                            {passedWriter.email}
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-black text-[#121A13]">
                        {writerName}
                      </h1>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                    <div className="bg-[#FAF6F0] border border-[#EADFCF] rounded-2xl p-3.5 text-center min-w-[100px]">
                      <p className="text-xl sm:text-2xl font-black text-[#121A13]">
                        {totalItems}
                      </p>
                      <p className="text-[11px] font-bold text-[#2B3B2E]/70 mt-0.5">
                        Toplam Kitap
                      </p>
                    </div>

                    <div className="bg-[#FAF6F0] border border-[#EADFCF] rounded-2xl p-3.5 text-center min-w-[100px]">
                      <p className="text-xl sm:text-2xl font-black text-emerald-700">
                        {profileStats.verifiedCount}
                      </p>
                      <p className="text-[11px] font-bold text-[#2B3B2E]/70 mt-0.5">
                        Onaylı Kitap
                      </p>
                    </div>

                    <div className="bg-[#FAF6F0] border border-[#EADFCF] rounded-2xl p-3.5 text-center min-w-[100px]">
                      <p className="text-xl sm:text-2xl font-black text-[#A06A42]">
                        {profileStats.uniqueCategories.length}
                      </p>
                      <p className="text-[11px] font-bold text-[#2B3B2E]/70 mt-0.5">
                        Kategori
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex items-center justify-start">
                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2B3B2E]/50">
                    <Icon name="search" size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Yazarın kitaplarında ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FFFDFB] border-2 border-[#DCD5CB] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#121A13] font-semibold placeholder-[#2B3B2E]/50 focus:outline-none focus:border-[#A06A42] transition-all"
                  />
                </div>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredBooks.map((book, index) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      index={index}
                      onDownload={handleDownload}
                      onDetailClick={handleDetailClick}
                    />
                  ))}
                </div>
              ) : (
                <NotFound
                  key="no-books"
                  icon="bookOpen"
                  title="Kitap Bulunamadı"
                  message={
                    searchQuery
                      ? 'Arama kriterlerinize uygun kitap bulunamadı.'
                      : 'Bu yazarın henüz yüklenmiş bir kitabı bulunmuyor.'
                  }
                  actionText={searchQuery ? 'Aramayı Temizle' : undefined}
                  onAction={searchQuery ? () => setSearchQuery('') : undefined}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDownload={handleDownload}
        />

      </div>
    </div>
  );
};

export default WriterDetail;
