
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfileLoading from './ProfileLoading';
import ProfileError from './ProfileError';

const ProfileContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error } = useUserProfile();

  if (authLoading || profileLoading) {
    return <ProfileLoading />;
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  if (error) {
    return <ProfileError error={error} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </motion.div>
  );
};

export default ProfileContent;
