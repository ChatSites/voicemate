
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RecordingArea from './RecordingArea';

interface PulseFormProps {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  pulseTitle: string;
  pulseDescription: string;
  isSending: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSendPulse: () => void;
}

const PulseForm: React.FC<PulseFormProps> = ({
  isRecording,
  recordingTime,
  recordingData,
  pulseTitle,
  pulseDescription,
  isSending,
  onStartRecording,
  onStopRecording,
  onResetRecording,
  onTitleChange,
  onDescriptionChange,
  onSendPulse
}) => {
  return (
    <Card className="bg-voicemate-card border-gray-800">
      <CardHeader>
        <CardTitle>Record Voice Message</CardTitle>
        <CardDescription>Record a clear message for the best experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Pulse Title"
            value={pulseTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-black/20 border-gray-700"
          />
          
          <Textarea
            placeholder="Description (optional)"
            value={pulseDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="bg-black/20 border-gray-700 min-h-[120px]"
          />
          
          <RecordingArea
            isRecording={isRecording}
            recordingTime={recordingTime}
            recordingData={recordingData}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onResetRecording={onResetRecording}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="bg-voicemate-purple hover:bg-purple-700 text-white w-full"
          disabled={!recordingData || isSending}
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
      </CardFooter>
    </Card>
  );
};

export default PulseForm;
