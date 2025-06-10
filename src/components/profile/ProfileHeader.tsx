
import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/hooks/useUserProfile';

interface ProfileHeaderProps {
  profile: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-voicemate-purple rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {profile?.name || 'Loading...'}
              </h1>
              <p className="text-voicemate-purple text-lg">
                @{profile?.pulse_id || 'loading'}
              </p>
              <p className="text-muted-foreground">
                {profile?.email || 'Loading...'}
              </p>
            </div>
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileHeader;
