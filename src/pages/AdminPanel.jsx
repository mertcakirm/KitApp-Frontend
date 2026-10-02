import React, { useState } from 'react';
import Icon from '../components/common/Icon';
import ProfileHeader from '../components/common/ProfileHeader';
import BookManagement from '../components/admin-panel/BookManagement';
import UserManagement from '../components/admin-panel/UserManagement';
import CategoryManagement from '../components/admin-panel/CategoryManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'users' | 'categories'

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      <div className="w-full max-w-6xl space-y-6 pb-12">
        
        <ProfileHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-2 p-1.5 bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'books'
                  ? 'bg-[#A06A42] text-[#FFFDFB] shadow-xs'
                  : 'text-[#2B3B2E]/70 hover:text-[#2B3B2E] hover:bg-[#FAF6F0]'
              }`}
            >
              <Icon name="sparkles" size={14} />
              <span>Kitap Yönetimi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#A06A42] text-[#FFFDFB] shadow-xs'
                  : 'text-[#2B3B2E]/70 hover:text-[#2B3B2E] hover:bg-[#FAF6F0]'
              }`}
            >
              <Icon name="shield" size={14} />
              <span>Kullanıcı Yönetimi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#A06A42] text-[#FFFDFB] shadow-xs'
                  : 'text-[#2B3B2E]/70 hover:text-[#2B3B2E] hover:bg-[#FAF6F0]'
              }`}
            >
              <Icon name="tag" size={14} />
              <span>Kategori Yönetimi</span>
            </button>
          </div>
        </div>

        {/* Sekme İçerikleri */}
        {activeTab === 'books' && <BookManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'categories' && <CategoryManagement />}

      </div>
    </div>
  );
};

export default AdminPanel;
