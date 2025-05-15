
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CTA } from '@/types/pulse';

interface PulseActionsProps {
  ctas: CTA[];
}

export const PulseActions: React.FC<PulseActionsProps> = ({ ctas }) => {
  const handleCTAClick = (cta: CTA) => {
    if (cta.url) {
      window.open(cta.url, '_blank');
    } else {
      // Default actions based on action type
      switch (cta.action) {
        case 'open_scheduling_link':
          toast({
            title: "Scheduling",
            description: "Opening scheduling calendar..."
          });
          break;
        case 'open_reply_input':
          // This would be handled differently in a real implementation
          toast({
            title: "Reply",
            description: "Opening reply form..."
          });
          break;
        case 'confirm_rsvp':
          toast({
            title: "RSVP Confirmed",
            description: "Your response has been recorded!"
          });
          break;
        default:
          toast({
            title: "Action Triggered",
            description: `Action: ${cta.action}`
          });
      }
    }
  };

  if (!ctas || ctas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">Actions:</h3>
      <div className="flex flex-wrap gap-3">
        {ctas.map((cta, index) => (
          <Button 
            key={index}
            className="bg-voicemate-purple hover:bg-purple-700 text-white"
            onClick={() => handleCTAClick(cta)}
          >
            {cta.emoji && <span className="mr-2">{cta.emoji}</span>}
            {cta.label}
            {cta.url && <ExternalLink className="ml-2 h-3 w-3" />}
          </Button>
        ))}
      </div>
    </div>
  );
};
