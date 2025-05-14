
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SendButtonProps {
  disabled: boolean;
  isSending: boolean;
  onSendPulse: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({
  disabled,
  isSending,
  onSendPulse
}) => {
  return (
    <Button 
      className="bg-voicemate-purple hover:bg-purple-700 text-white w-full"
      disabled={disabled}
      onClick={onSendPulse}
    >
      {isSending ? (
        <>Sending Pulse...</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Send Pulse
        </>
      )}
    </Button>
  );
};

export default SendButton;
