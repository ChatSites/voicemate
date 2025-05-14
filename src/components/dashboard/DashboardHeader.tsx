
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/hooks/useUserProfile';

interface DashboardHeaderProps {
  displayName: string;
  displayPulseId: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ displayName, displayPulseId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-white">
        Welcome, {displayName}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        @{displayPulseId}
      </p>
      <p className="text-muted-foreground mt-2">
        Manage your voice messages and interactions
      </p>
    </motion.div>
  );
};

export default DashboardHeader;
