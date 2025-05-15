
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/components/providers/ThemeProvider';

interface PulseLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PulseLayout: React.FC<PulseLayoutProps> = ({ children, title }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
