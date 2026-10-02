import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import ChangePasswordModal from './ChangePasswordModal';
import ConfirmModal from './ConfirmModal';
import { clearAllCookies } from '../../utils/cookie';
import { UserApi } from '../../api/userApi';

const ProfileHeader = ({ onProfileLoaded }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await UserApi.getMyProfile();
      const profileData = res?.data || res;
      setProfile(profileData);
      if (onProfileLoaded) {
        onProfileLoaded(profileData);
      }
    } catch (error) {
      console.error('Profil bilgileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAllCookies();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await UserApi.deleteMyProfile();
      clearAllCookies();
      navigate('/login');
    } catch (error) {
      console.error('Profil silinirken hata oluştu:', error);
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isAdmin = profile?.role?.name?.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="w-full p-5 bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-2xs animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EADFCF]/60" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-[#EADFCF]/60 rounded" />
            <div className="h-3 w-52 bg-[#EADFCF]/40 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-[#EADFCF]/50 rounded-xl" />
          <div className="h-10 w-28 bg-[#EADFCF]/50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full p-5 bg-[#FFFDFB] border border-[#EADFCF] rounded-2xl shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Sol Taraf: Kullanıcı Bilgileri */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A06A42]/10 border border-[#A06A42]/20 flex items-center justify-center text-[#A06A42] font-black text-lg uppercase shrink-0">
            {profile?.username ? profile.username.slice(0, 2) : 'AD'}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black text-[#2B3B2E] tracking-tight">
                {profile?.username || 'Kullanıcı'}
              </h2>
              {profile?.role?.name && (
                <span className="px-2.5 py-0.5 rounded-lg bg-[#A06A42] text-[#FFFDFB] text-[10px] font-black uppercase tracking-wider">
                  {profile.role.name}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#2B3B2E]/70 font-medium">
              <span>{profile?.email}</span>
              <span className="text-[#EADFCF]">•</span>
              <span>
                Kitap Sayısı: <strong className="text-[#2B3B2E]">{profile?.bookCount ?? 0}</strong>
              </span>
              {profile?.createdAt && (
                <>
                  <span className="text-[#EADFCF]">•</span>
                  <span>Katılım: {formatDate(profile.createdAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#EADFCF]/60">
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#A06A42] text-[#2B3B2E] hover:text-[#FFFDFB] border border-[#EADFCF] hover:border-[#A06A42] text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer"
          >
            <Icon name="lock" size={14} />
            <span>Şifre Değiştir</span>
          </button>

          {!isAdmin && (
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-rose-600 text-rose-600 hover:text-[#FFFDFB] border border-[#EADFCF] hover:border-rose-600 text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer"
            >
              <Icon name="trash" size={14} />
              <span>Hesabı Sil</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B3B2E] hover:bg-[#2B3B2E]/90 text-[#FFFDFB] text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer"
          >
            <Icon name="log-out" size={14} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {!isAdmin && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Hesabı Kalıcı Olarak Sil"
          message="Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve profilinize bağlı tüm veriler kalıcı olarak kaldırılır."
          confirmText="Evet, Hesabımı Sil"
          cancelText="Vazgeç"
          loading={isDeleting}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </div>
  );
};

export default ProfileHeader;
