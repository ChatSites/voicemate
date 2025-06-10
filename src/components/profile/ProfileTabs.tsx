
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/hooks/useUserProfile';
import ProfileTab from './ProfileTab';
import PulseIdTab from './PulseIdTab';
import PreferencesTab from './PreferencesTab';
import AccountTab from './AccountTab';
import HowItWorksTab from './HowItWorksTab';

interface ProfileTabsProps {
  profile: UserProfile | null;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-voicemate-card border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-voicemate-purple">
            Profile
          </TabsTrigger>
          <TabsTrigger value="pulseid" className="data-[state=active]:bg-voicemate-purple">
            PulseID
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-voicemate-purple">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="how-it-works" className="data-[state=active]:bg-voicemate-purple">
            How It Works
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-voicemate-purple">
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="pulseid" className="mt-6">
          <PulseIdTab profile={profile} />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <PreferencesTab />
        </TabsContent>

        <TabsContent value="how-it-works" className="mt-6">
          <HowItWorksTab />
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <AccountTab profile={profile} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTabs;
