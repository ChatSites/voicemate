
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlayCircle, PauseCircle, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Define the Pulse interface to match our database structure
interface Pulse {
  id: string;
  audio_url: string;
  transcript: string;
  intent: string;
  ctas: Array<{
    label: string;
    action: string;
    url?: string;
    emoji?: string;
  }>;
  pulse_id: string;
  created_at: string;
}

export default function ViewPulse() {
  const { pulseId } = useParams<{ pulseId: string }>();
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Fetch pulse data
  useEffect(() => {
    const fetchPulse = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pulses')
          .select('*')
          .eq('id', pulseId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setPulse(data as Pulse);
          // Create audio element
          const audio = new Audio(data.audio_url);
          audio.addEventListener('ended', () => setIsPlaying(false));
          setAudioElement(audio);
        } else {
          toast({
            title: "Pulse Not Found",
            description: "We couldn't find the pulse you're looking for.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching pulse:', error);
        toast({
          title: "Error",
          description: "Failed to load pulse data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (pulseId) {
      fetchPulse();
    }
    
    return () => {
      // Cleanup audio element
      if (audioElement) {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [pulseId]);
  
  // Play/Pause toggle
  const togglePlayback = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play().catch(err => {
        console.error('Error playing audio:', err);
        toast({
          title: "Playback Error",
          description: "Could not play this audio message.",
          variant: "destructive"
        });
      });
      setIsPlaying(true);
    }
  };
  
  // Handle CTA action
  const handleCTAClick = (cta: { label: string, action: string, url?: string }) => {
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-voicemate-card border-gray-800">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-3/4 bg-gray-700 mb-2" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-800 h-16 flex items-center justify-center">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-5/6 bg-gray-700" />
                <Skeleton className="h-4 w-4/6 bg-gray-700" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-32 rounded-full bg-gray-700" />
                <Skeleton className="h-10 w-32 rounded-full bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!pulse) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6">
        <Card className="bg-voicemate-card border-gray-800 max-w-md w-full">
          <CardHeader>
            <CardTitle>Pulse Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              We couldn't find the pulse you're looking for. It may have been removed or the link might be incorrect.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/">
              <Button className="bg-voicemate-purple hover:bg-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-voicemate-card border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="ml-1">Home</span>
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl">{pulse.intent}</CardTitle>
            <div className="text-sm text-gray-400">
              From: {pulse.pulse_id || 'Anonymous'} • {new Date(pulse.created_at).toLocaleDateString()}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Audio Player */}
            <div className="rounded-lg bg-gray-900 p-4 flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={togglePlayback}
                className="h-12 w-12 rounded-full border-voicemate-purple hover:bg-voicemate-purple/20"
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8 text-voicemate-purple" />
                ) : (
                  <PlayCircle className="h-8 w-8 text-voicemate-purple" />
                )}
              </Button>
              <div className="flex-1">
                <div className="text-sm text-gray-400">
                  {isPlaying ? 'Playing voice message...' : 'Voice message'}
                </div>
                <div className="h-1 bg-gray-700 rounded-full mt-2">
                  <div className={`h-full bg-voicemate-purple rounded-full ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: isPlaying ? '30%' : '0%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Transcript */}
            {pulse.transcript && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">Transcript:</h3>
                <div className="bg-gray-900/50 p-4 rounded-md text-gray-200">
                  {pulse.transcript}
                </div>
              </div>
            )}
            
            {/* CTA Buttons */}
            {pulse.ctas && pulse.ctas.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">Actions:</h3>
                <div className="flex flex-wrap gap-3">
                  {pulse.ctas.map((cta, index) => (
                    <Button 
                      key={index}
                      className="bg-voicemate-purple hover:bg-purple-700"
                      onClick={() => handleCTAClick(cta)}
                    >
                      {cta.emoji && <span className="mr-2">{cta.emoji}</span>}
                      {cta.label}
                      {cta.url && <ExternalLink className="ml-2 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
