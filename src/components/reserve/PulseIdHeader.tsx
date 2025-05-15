
import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

type PulseIdHeaderProps = {
  title: string;
  description: string;
}

const PulseIdHeader: React.FC<PulseIdHeaderProps> = ({ title, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${isDark ? 'bg-voicemate-purple/20' : 'bg-voicemate-purple/10'} text-voicemate-purple`}>
          <Key className="h-6 w-6" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className={`text-xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{description}</p>
      </motion.div>
    </>
  );
};

export default PulseIdHeader;
