
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { isPulseIdTaken } from '@/integrations/supabase/client';
import { ArrowRight, Check, Key, CircleCheck, CircleX } from 'lucide-react';

const ReservePulseID = () => {
  const [pulseId, setPulseId] = useState('');
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const [pulseIdSuggestions, setPulseIdSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Real-time PulseID verification
  useEffect(() => {
    const checkPulseId = async () => {
      if (!pulseId || pulseId.length < 3) {
        setPulseIdAvailable(null);
        setPulseIdSuggestions([]);
        return;
      }

      setIsCheckingPulseId(true);
      
      try {
        console.log(`Checking availability for PulseID: ${pulseId}`);
        
        const isTaken = await isPulseIdTaken(pulseId);
        const isAvailable = !isTaken;
        
        console.log(`PulseID ${pulseId} is ${isAvailable ? 'available' : 'taken'}`);
        
        setPulseIdAvailable(isAvailable);
        
        // Generate suggestions if not available
        if (!isAvailable) {
          const suggestions = [
            `${pulseId}${Math.floor(Math.random() * 100)}`,
            `${pulseId}_${Math.floor(Math.random() * 100)}`,
            `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
          ];
          setPulseIdSuggestions(suggestions);
        } else {
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID:', error);
        setPulseIdAvailable(null);
      } finally {
        setIsCheckingPulseId(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timerId = setTimeout(checkPulseId, 500);
    return () => clearTimeout(timerId);
  }, [pulseId]);
  
  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
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
                      className={`rounded-l-none bg-black/30 border-gray-700 ${
                        pulseIdAvailable === false ? "border-red-500 pr-9" : 
                        pulseIdAvailable === true ? "border-green-500 pr-9" : ""
                      }`}
                      value={pulseId}
                      onChange={(e) => {
                        setPulseId(e.target.value);
                      }}
                      required
                    />
                    {isCheckingPulseId && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
                      </div>
                    )}
                    {!isCheckingPulseId && pulseIdAvailable !== null && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pulseIdAvailable ? (
                          <CircleCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <CircleX className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {pulseId.length > 0 && pulseId.length < 3 && (
                  <p className="text-sm text-amber-400">PulseID must be at least 3 characters</p>
                )}
                
                {/* Show suggestions if PulseID is taken */}
                {pulseIdAvailable === false && pulseIdSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-amber-400 mb-1">This PulseID is already taken. Try one of these:</p>
                    <div className="flex flex-wrap gap-2">
                      {pulseIdSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-xs border-voicemate-purple text-voicemate-purple hover:bg-voicemate-purple/20"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-voicemate-red hover:bg-red-600"
                    onClick={proceedToSignup}
                    disabled={!pulseIdAvailable || pulseId.length < 3}
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
