
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Inbox, Archive } from 'lucide-react';

interface EmptyStateProps {
  type: 'inbox' | 'archived';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="bg-voicemate-card p-4 rounded-full inline-block mb-4">
        {type === 'inbox' ? (
          <Inbox className="h-6 w-6 text-gray-400" />
        ) : (
          <Archive className="h-6 w-6 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {type === 'inbox' ? 'Your inbox is empty' : 'No archived messages'}
      </h3>
      <p className="text-muted-foreground mb-6">
        {type === 'inbox' 
          ? 'You don\'t have any voice messages yet' 
          : 'You don\'t have any archived voice messages'}
      </p>
      {type === 'inbox' && (
        <Button 
          className="bg-voicemate-purple hover:bg-purple-700"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
