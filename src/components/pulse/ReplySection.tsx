
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ReplySection: React.FC = () => {
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) return;
    
    try {
      // Here you would implement the actual reply submission to your database
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully!"
      });
      setReplyMessage('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (isReplying) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Your Reply:</h3>
        <div className="flex gap-2">
          <Input
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={handleReplySubmit}
            className="bg-voicemate-purple hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => setIsReplying(true)}
      className="bg-voicemate-purple hover:bg-purple-700 text-white"
    >
      <Send className="mr-2 h-4 w-4" /> Reply to this Pulse
    </Button>
  );
};
