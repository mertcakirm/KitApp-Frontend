import React, { useState } from 'react';
import ProfileHeader from '../components/common/ProfileHeader';
import WriterBookManagement from '../components/writer-panel/WriterBookManagement';

const UserProfile = () => {
  const [userId, setUserId] = useState(null);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#FAF6F0] flex flex-col items-center px-4 md:px-8 py-8 md:py-12 font-sans transition-colors duration-300">
      <div className="w-full max-w-6xl space-y-6 pb-12">
        <ProfileHeader onProfileLoaded={(profile) => setUserId(profile?.id)} />

        {userId && <WriterBookManagement userId={userId} />}
      </div>
    </div>
  );
};

export default UserProfile;
