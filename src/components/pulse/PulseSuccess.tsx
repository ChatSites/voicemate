
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface PulseSuccessProps {
  pulseUrl: string;
  pulseTitle: string;
  onReset: () => void;
  onDone: () => void;
}

const PulseSuccess: React.FC<PulseSuccessProps> = ({
  pulseUrl,
  pulseTitle,
  onReset,
  onDone
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pulseUrl).then(() => {
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Pulse link has been copied to clipboard"
      });
      
      // Reset copy state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pulseTitle || 'Check out my Voice Pulse',
          text: 'Check out my Voice Pulse message',
          url: pulseUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy if sharing fails
        handleCopy();
      }
    } else {
      // Fallback to copy if Web Share API is not available
      handleCopy();
    }
  };

  return (
    <Card className="bg-voicemate-card border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="bg-green-500/20 p-2 rounded-full">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          Pulse Sent Successfully!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Your Pulse</h3>
          <p className="text-xl font-semibold text-voicemate-purple mb-4">"{pulseTitle}"</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Shareable Link:</h3>
          <div className="flex items-center">
            <Input 
              value={pulseUrl} 
              readOnly 
              className="bg-gray-900 border-gray-700 focus-visible:ring-voicemate-purple"
            />
            <Button 
              variant="outline"
              size="icon"
              className="ml-2 border-gray-700 hover:bg-gray-800"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 mt-6">
          <Button 
            className="bg-voicemate-purple hover:bg-purple-700 text-white"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share Pulse
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-6">
        <div className="flex w-full gap-4">
          <Button 
            variant="outline"
            className="flex-1 border-gray-700 hover:bg-gray-800"
            onClick={onReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Create Another
          </Button>
          <Button 
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PulseSuccess;
