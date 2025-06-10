
import React from 'react';
import { motion } from 'framer-motion';
import DashboardCards from './DashboardCards';

const DashboardOverview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <DashboardCards />
    </motion.div>
  );
};

export default DashboardOverview;
