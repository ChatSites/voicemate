
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { isPulseIdTaken } from '@/integrations/supabase/client';
import { ArrowRight, Check, Key } from 'lucide-react';

const ReservePulseID = () => {
  const [pulseId, setPulseId] = useState('');
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  const checkAvailability = async () => {
    if (!pulseId || pulseId.length < 3) {
      toast({
        title: "Invalid PulseID",
        description: "PulseID must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingPulseId(true);
    try {
      const isTaken = await isPulseIdTaken(pulseId);
      setPulseIdAvailable(!isTaken);
      
      if (isTaken) {
        toast({
          title: "PulseID is taken",
          description: "Please try a different PulseID",
          variant: "destructive",
        });
      } else {
        toast({
          title: "PulseID is available!",
          description: "Continue to claim this PulseID",
        });
      }
    } catch (error) {
      toast({
        title: "Error checking availability",
        description: "Please try again later",
        variant: "destructive",
      });
      setPulseIdAvailable(null);
    } finally {
      setIsCheckingPulseId(false);
    }
  };
  
  const proceedToSignup = () => {
    if (pulseIdAvailable) {
      // Navigate to the signup page with the PulseID as a URL parameter
      navigate(`/auth?tab=register&pulseId=${pulseId}`);
    } else {
      toast({
        title: "Check availability first",
        description: "Please verify that your PulseID is available",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-center">Reserve Your PulseID</CardTitle>
              <CardDescription className="text-center">Claim your unique voice identity</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-voicemate-purple/20 text-voicemate-purple">
                    <Key className="h-6 w-6" />
                  </div>
                </div>
                
                <Label htmlFor="pulse-id">Choose Your PulseID</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm bg-black/50 rounded-l-md border border-r-0 border-gray-700 text-gray-400">
                    pulse/
                  </span>
                  <div className="relative flex-1">
                    <Input 
                      id="pulse-id" 
                      placeholder="yourname" 
                      className="rounded-l-none bg-black/30 border-gray-700"
                      value={pulseId}
                      onChange={(e) => {
                        setPulseId(e.target.value);
                        setPulseIdAvailable(null);
                      }}
                      required
                    />
                    {isCheckingPulseId && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
                      </div>
                    )}
                    {!isCheckingPulseId && pulseIdAvailable === true && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                {pulseId.length > 0 && pulseId.length < 3 && (
                  <p className="text-sm text-amber-400">PulseID must be at least 3 characters</p>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-voicemate-purple hover:bg-voicemate-purple/80" 
                    onClick={checkAvailability}
                    disabled={isCheckingPulseId || pulseId.length < 3}
                  >
                    Check Availability
                  </Button>
                  
                  <Button 
                    className="flex-1 bg-voicemate-red hover:bg-red-600"
                    onClick={proceedToSignup}
                    disabled={!pulseIdAvailable}
                  >
                    Reserve <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-medium">Why reserve a PulseID?</h3>
                <ul className="space-y-2">
                  {[
                    "Your unique voice identifier for the future",
                    "Control who can reach you and when",
                    "No more spam calls or unwanted messages",
                    "Gateway to voice-authenticated services"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-voicemate-purple mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-voicemate-purple hover:text-voicemate-red transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservePulseID;
