
import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';

type PulseIdHeaderProps = {
  title: string;
  description: string;
}

const PulseIdHeader: React.FC<PulseIdHeaderProps> = ({ title, description }) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-voicemate-purple/20 text-voicemate-purple">
          <Key className="h-6 w-6" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-center">{title}</h2>
        <p className="text-center text-gray-400 mt-2">{description}</p>
      </motion.div>
    </>
  );
};

export default PulseIdHeader;
