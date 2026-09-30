// src/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import PageHeader from '../components/Home/PageHeader';
import SearchBar from '../components/Home/SearchBar';
import BookCard from '../components/Home/BookCard';
import BookDetailModal from '../components/Home/BookDetailModal';
import { BookApi } from '../api/bookApi';

const API_BASE_URL = 'http://localhost:5000';

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });

  const fetchBooks = async (page = 1, searchQuery = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await BookApi.getAll(page, 12, searchQuery);
      console.log(data);
      
      if (data) {
        setBooks(data.books || []);
        setPagination({
          totalItems: data.totalItems,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        });
      }
    } catch (err) {
      console.error("Kitaplar çekilirken hata oluştu:", err);
      setError("Arşiv yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Sayfa ilk açıldığında verileri çeker
  useEffect(() => {
    fetchBooks(1, "");
  }, []);

  // 2. Arama inputu için Debounced Search (Gereksiz istekleri önler)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Eğer arama kutusu değiştiyse otomatik olarak 1. sayfadan aramayı başlat
      fetchBooks(1, search);
    }, 400); // 400ms debounce süresi

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // PDF İndirme İşleyicisi
  const handleDownload = (book) => {
    if (!book.filePath) {
      alert("Bu kitaba ait PDF dosyası bulunamadı.");
      return;
    }

    // PDF URL'sini backend API yolu ile birleştirip yeni sekmede açarak indirmeyi tetikliyoruz
    const pdfUrl = book.filePath.startsWith('http') 
      ? book.filePath 
      : `${API_BASE_URL}${book.filePath}`;
      
    // Yeni pencerede indirme başlatılır
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
      
      {/* 1. SAYFA BAŞLIĞI BİLEŞENİ */}
      <PageHeader 
        badgeText="Zengin PDF Kütüphanesi"
        title="Kitapların PDF’lerine"
        subtitle="Sadece indirme amaçlı kütüphanemizden dilediğiniz kitapların PDF’lerini indirin, kendi çevrimdışı arşivinizi oluşturun."
      />

      {/* 2. ARAMA BARI BİLEŞENİ */}
      <SearchBar 
        value={search} 
        onChange={setSearch} 
        onPopularClick={setSearch} 
      />

      {/* 3. GRID ALANI (SONUÇLARIN GÖSTERİLDİĞİ YER) */}
      <div className="w-full max-w-6xl pb-12">
        
        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-[#A06A42] gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-bold text-sm">PDF arşivinden kitaplar getiriliyor...</span>
          </div>
        )}

        {/* Hata Durumu */}
        {!loading && error && (
          <div className="text-center py-12 text-red-700 font-bold">
            {error}
          </div>
        )}

        {/* Veriler Başarıyla Çekildiğinde Listeleme */}
        {!loading && !error && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b-2 border-[#EADFCF] pb-3 pl-1">
              <div className="flex items-center gap-2 text-xs font-black text-[#A06A42] uppercase tracking-wider">
                <Sparkles size={14} className="text-[#A06A42] shrink-0 animate-pulse" />
                <span>
                  {search.trim() === "" ? "Tüm Kitap PDF Arşivi" : `Arama Sonuçları (${pagination.totalItems})`}
                </span>
              </div>
            </div>
            
            {books.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {books.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onDownload={handleDownload} 
                    onDetailClick={setSelectedBook} // Detay popup'ı için kitabı state'e aktarır
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-sm font-bold text-[#2B3B2E]/70">
                "{search}" aramasıyla eşleşen bir kitap PDF'i bulunamadı.
              </div>
            )}

            {/* Sayfalama (Pagination) Kontrolleri (Varsa) */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchBooks(pagination.currentPage - 1, search)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCD5CB] bg-white text-xs font-bold text-[#2B3B2E] disabled:opacity-50 hover:bg-[#EADFCF] transition-all cursor-pointer"
                >
                  Önceki
                </button>
                <span className="text-xs font-black text-[#1E2A20]">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => fetchBooks(pagination.currentPage + 1, search)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCD5CB] bg-white text-xs font-bold text-[#2B3B2E] disabled:opacity-50 hover:bg-[#EADFCF] transition-all cursor-pointer"
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. DETAY POPUP MODAL (Karta tıklanınca ekranda belirir) */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onDownload={handleDownload}
        />
      )}

    </div>
  );
};

export default Home;
