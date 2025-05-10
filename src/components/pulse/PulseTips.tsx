
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic, Send, AudioWaveform } from 'lucide-react';

const PulseTips: React.FC = () => {
  return (
    <Card className="bg-voicemate-card border-gray-800">
      <CardHeader>
        <CardTitle>Tips for Great Pulses</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start">
            <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
              <Mic className="h-3 w-3 text-voicemate-purple" />
            </div>
            <span>Speak clearly and at a moderate pace</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
              <AudioWaveform className="h-3 w-3 text-voicemate-purple" />
            </div>
            <span>Find a quiet place with minimal background noise</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
              <Send className="h-3 w-3 text-voicemate-purple" />
            </div>
            <span>Keep messages concise and focused</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
              <AudioWaveform className="h-3 w-3 text-voicemate-purple" />
            </div>
            <span>State your key points early in the recording</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PulseTips;
