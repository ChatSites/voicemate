
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const InboxHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold">Inbox</h1>
        <p className="text-muted-foreground mt-2">Manage your received voice messages</p>
      </div>
      <Button 
        className="bg-voicemate-red hover:bg-red-600 text-white mt-4 md:mt-0"
        onClick={() => navigate('/create')}
      >
        <Send className="mr-2 h-4 w-4" /> Send New Pulse
      </Button>
    </motion.div>
  );
};

export default InboxHeader;
