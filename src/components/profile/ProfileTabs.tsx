import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileTabsDesktop from './ProfileTabsDesktop';
import ProfileTab from './ProfileTab';
import PulseIdTab from './PulseIdTab';
import PreferencesTab from './PreferencesTab';
import AccountTab from './AccountTab';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileTabsProps {
  profile: UserProfile | null;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Use desktop layout for larger screens
  if (!isMobile) {
    return <ProfileTabsDesktop profile={profile} />;
  }

  // Keep original mobile layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-voicemate-card border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-voicemate-purple">
            Profile
          </TabsTrigger>
          <TabsTrigger value="pulseid" className="data-[state=active]:bg-voicemate-purple">
            PulseID
          </TabsTrigger>
        </TabsList>

        <TabsList className="grid w-full grid-cols-2 bg-voicemate-card border-gray-800 mt-2">
          <TabsTrigger value="preferences" className="data-[state=active]:bg-voicemate-purple">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-voicemate-purple">
            Account
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full border-gray-700 mb-6"
            onClick={() => navigate('/profile/how-it-works')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            How It Works Guide
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Button>
        </div>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="pulseid" className="mt-6">
          <PulseIdTab profile={profile} />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <PreferencesTab />
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <AccountTab profile={profile} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTabs;
