
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

interface PulseLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PulseLayout: React.FC<PulseLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PulseLayout;
