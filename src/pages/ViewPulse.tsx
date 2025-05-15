
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePulseData } from '@/hooks/usePulseData';
import { PulseHeader } from '@/components/pulse/PulseHeader';
import { AudioPlayer } from '@/components/pulse/AudioPlayer';
import { TranscriptDisplay } from '@/components/pulse/TranscriptDisplay';
import { PulseActions } from '@/components/pulse/PulseActions';
import { ReplySection } from '@/components/pulse/ReplySection';
import { PulseLoadingState } from '@/components/pulse/LoadingState';
import { PulseNotFoundState } from '@/components/pulse/NotFoundState';

export default function ViewPulse() {
  const { pulseId } = useParams<{ pulseId: string }>();
  const { pulse, loading, error } = usePulseData(pulseId);
  
  if (loading) {
    return <PulseLoadingState />;
  }
  
  if (error || !pulse) {
    return <PulseNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-voicemate-card border-gray-800">
          <CardHeader className="pb-4">
            <PulseHeader 
              intent={pulse.intent}
              pulseId={pulse.pulse_id}
              createdAt={pulse.created_at}
            />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Audio Player */}
            {pulse.audio_url && (
              <AudioPlayer audioUrl={pulse.audio_url} />
            )}
            
            {/* Transcript */}
            {pulse.transcript && (
              <TranscriptDisplay transcript={pulse.transcript} />
            )}
            
            {/* CTA Buttons */}
            <PulseActions ctas={pulse.ctas} />
            
            {/* Reply Section */}
            <ReplySection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
