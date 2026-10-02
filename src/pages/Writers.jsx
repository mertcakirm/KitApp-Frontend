// src/pages/Writers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/common/Icon';
import Loading from '../components/common/Loading';
import NotFound from '../components/common/NotFound';
import PageHeader from '../components/home/PageHeader';
import SearchBar from '../components/common/SearchBar';
import WriterCard from '../components/writers/WriterCard';
import { UserApi } from '../api/userApi';

const LIMIT = 9;

const Writers = () => {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [observerTarget, setObserverTarget] = useState(null);

  const fetchWriters = useCallback(async (page = 1, searchQuery = '', isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await UserApi.getAllWriters(page, LIMIT, searchQuery);

      if (data) {
        const fetchedUsers = data.users || [];

        setWriters((prev) => {
          if (!isAppend) return fetchedUsers;
          const existingIds = new Set(prev.map((w) => w.id || w._id));
          const uniqueNewWriters = fetchedUsers.filter((w) => !existingIds.has(w.id || w._id));
          return [...prev, ...uniqueNewWriters];
        });

        const totalItems = Number(data.totalItems ?? data.total ?? 0);
        const calculatedTotalPages = Math.ceil(totalItems / LIMIT) || 1;
        const totalPages = Number(data.totalPages ?? calculatedTotalPages);
        const currentPage = Number(data.currentPage ?? page);

        setPagination({
          totalItems,
          totalPages,
          currentPage,
        });
      }
    } catch (err) {
      console.error('Yazarlar yüklenirken hata oluştu:', err);
      if (!isAppend) {
        setError('Yazarlar listelenirken bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchWriters(1, search, false);
  }, [search, fetchWriters]);

  useEffect(() => {
    if (!observerTarget) return;

    const hasMore = pagination.currentPage < pagination.totalPages;
    if (!hasMore || loading || loadingMore || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchWriters(pagination.currentPage + 1, search, true);
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [observerTarget, pagination.currentPage, pagination.totalPages, loading, loadingMore, error, search, fetchWriters]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      
      <PageHeader 
        badgeText={`Yazar Arşivi ${pagination.totalItems > 0 ? `(${pagination.totalItems})` : ''}`}
        title="Kütüphanemizin Değerli"
        subtitle="Sistemimizde eserleri bulunan yazarları keşfedin, kaleme aldıkları PDF kitap arşivlerine göz atın."
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Yazar adı ara..."
        debounceTime={2000}
        size="md"
        showSuggestions={false}
        showProgressBar={true}
        containerClassName="w-full max-w-md px-2 sm:px-0 shrink-0 mb-10"
      />

      <div className="w-full max-w-6xl pb-12">
        <AnimatePresence mode="wait">
          {loading && (
            <Loading key="loading" message="Yazarlar listeleniyor..." />
          )}

          {!loading && error && writers.length === 0 && (
            <NotFound
              key="error"
              icon="alertTriangle"
              title="Bağlantı Hatası"
              message={error}
              actionText="Tekrar Dene"
              onAction={() => fetchWriters(1, search, false)}
            />
          )}

          {!loading && !error && (
            <motion.div
              key={`writers-content-${search}`}
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
                    {search.trim() === '' ? 'Tüm Yazarlar' : `Arama Sonuçları (${pagination.totalItems})`}
                  </span>
                </div>
              </div>

              {writers.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {writers.map((writer, index) => (
                      <WriterCard key={writer.id || writer._id} writer={writer} index={index % LIMIT} />
                    ))}
                  </div>

                  {/* SCROLL TETİKLEYİCİ VE ALT YÜKLENİYOR GÖSTERGESİ */}
                  <div 
                    ref={setObserverTarget} 
                    className="w-full min-h-[40px] py-6 flex flex-col justify-center items-center"
                  >
                    <AnimatePresence mode="wait">
                      {loadingMore && (
                        <motion.div
                          key="loading-more-writers"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2.5 text-[#A06A42] bg-[#FFFDFB] border border-[#EADFCF] px-4 py-2 rounded-full shadow-xs"
                        >
                          <Icon name="loader" size={16} spin variant="primary" />
                          <span className="text-xs font-bold text-[#2B3B2E]">Daha fazla yazar yükleniyor...</span>
                        </motion.div>
                      )}

                      {!loadingMore && pagination.currentPage >= pagination.totalPages && pagination.totalPages > 1 && (
                        <motion.div
                          key="end-of-writers"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] font-bold text-[#2B3B2E]/50 pt-2"
                        >
                          Tüm yazarlar listelendi ({writers.length} yazar)
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <NotFound
                  key="not-found"
                  icon="user"
                  title="Yazar Bulunamadı"
                  message={
                    search
                      ? `"${search}" aramasıyla eşleşen herhangi bir yazar bulunamadı.`
                      : 'Henüz sistemde kayıtlı yazar bulunmuyor.'
                  }
                  actionText={search ? 'Aramayı Temizle' : undefined}
                  onAction={search ? () => setSearch('') : undefined}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Writers;
