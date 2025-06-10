
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';

interface PulseIdTabProps {
  profile: UserProfile | null;
}

const PulseIdTab: React.FC<PulseIdTabProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  
  const pulseUrl = profile?.pulse_id ? `https://voicemate.id/pulse/${profile.pulse_id}` : '';

  const copyPulseUrl = async () => {
    try {
      await navigator.clipboard.writeText(pulseUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "PulseID URL copied to clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive"
      });
    }
  };

  const openPulseUrl = () => {
    if (pulseUrl) {
      window.open(pulseUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            PulseID Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pulse-id">Your PulseID</Label>
            <Input
              id="pulse-id"
              value={profile?.pulse_id || ''}
              disabled
              className="bg-gray-800 border-gray-700 opacity-50 font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Your unique PulseID cannot be changed after registration.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pulse-url">Your PulseID URL</Label>
            <div className="flex space-x-2">
              <Input
                id="pulse-url"
                value={pulseUrl}
                disabled
                className="bg-gray-800 border-gray-700 opacity-50 font-mono flex-1"
              />
              <Button
                onClick={copyPulseUrl}
                variant="outline"
                size="icon"
                className="border-gray-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={openPulseUrl}
                variant="outline"
                size="icon"
                className="border-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this URL with others so they can send you voice messages.
            </p>
          </div>

          <div className="p-4 bg-background rounded-lg border border-gray-700">
            <h4 className="font-medium mb-2">How to use your PulseID:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Share your PulseID URL with contacts</li>
              <li>• Others can send you voice messages through this link</li>
              <li>• All messages will appear in your Inbox</li>
              <li>• Your PulseID is permanent and cannot be changed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PulseIdTab;
