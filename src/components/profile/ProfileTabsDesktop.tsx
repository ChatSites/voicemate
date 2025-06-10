import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileSidebar from './ProfileSidebar';
import ProfileTab from './ProfileTab';
import PulseIdTab from './PulseIdTab';
import PreferencesTab from './PreferencesTab';
import AccountTab from './AccountTab';

interface ProfileTabsDesktopProps {
  profile: UserProfile | null;
}

const ProfileTabsDesktop: React.FC<ProfileTabsDesktopProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useIsMobile();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab profile={profile} />;
      case 'pulseid':
        return <PulseIdTab profile={profile} />;
      case 'preferences':
        return <PreferencesTab />;
      case 'account':
        return <AccountTab profile={profile} />;
      default:
        return <ProfileTab profile={profile} />;
    }
  };

  if (isMobile) {
    // Keep original tabs for mobile
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-8"
    >
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <ProfileSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileTabsDesktop;
