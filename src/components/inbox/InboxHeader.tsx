
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Trash, Archive, Inbox as InboxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface InboxHeaderProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onArchiveSelected: () => void;
  onUnarchiveSelected: () => void;
  isDeleting: boolean;
  activeTab: string;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ 
  selectedCount, 
  onDeleteSelected, 
  onArchiveSelected,
  onUnarchiveSelected,
  isDeleting, 
  activeTab 
}) => {
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
      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
        {selectedCount > 0 && (
          <>
            <Button 
              variant="destructive"
              onClick={onDeleteSelected}
              disabled={isDeleting}
              className="flex items-center"
            >
              <Trash className="mr-2 h-4 w-4" /> 
              Delete {selectedCount} {selectedCount === 1 ? 'Pulse' : 'Pulses'}
            </Button>
            
            {activeTab === 'inbox' && (
              <Button 
                variant="outline"
                onClick={onArchiveSelected}
                disabled={isDeleting}
                className="flex items-center"
              >
                <Archive className="mr-2 h-4 w-4" /> 
                Archive {selectedCount} {selectedCount === 1 ? 'Pulse' : 'Pulses'}
              </Button>
            )}
            
            {activeTab === 'archived' && (
              <Button 
                variant="outline"
                onClick={onUnarchiveSelected}
                disabled={isDeleting}
                className="flex items-center"
              >
                <InboxIcon className="mr-2 h-4 w-4" /> 
                Move to Inbox
              </Button>
            )}
          </>
        )}
        <Button 
          className="bg-voicemate-red hover:bg-red-600 text-white"
          onClick={() => navigate('/create')}
        >
          <Send className="mr-2 h-4 w-4" /> Send New Pulse
        </Button>
      </div>
    </motion.div>
  );
};

export default InboxHeader;
