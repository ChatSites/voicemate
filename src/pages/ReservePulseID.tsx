
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import PulseIdInput from '@/components/reserve/PulseIdInput';
import BenefitsList from '@/components/reserve/BenefitsList';
import PulseIdHeader from '@/components/reserve/PulseIdHeader';

const ReservePulseID = () => {
  const [pulseId, setPulseId] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  const proceedToSignup = () => {
    if (pulseIdAvailable) {
      // Navigate directly to the auth page with the register tab selected and the PulseID prefilled
      navigate(`/auth?tab=register&pulseId=${pulseId}`);
    } else {
      toast({
        title: "Check availability first",
        description: "Please verify that your PulseID is available",
        variant: "destructive",
      });
    }
  };

  const benefits = [
    "Your unique voice identifier for the future",
    "Control who can reach you and when",
    "No more spam calls or unwanted messages",
    "Gateway to voice-authenticated services"
  ];

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
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <PulseIdHeader 
                  title="Reserve Your PulseID" 
                  description="Claim your unique voice identity" 
                />
                
                <PulseIdInput 
                  pulseId={pulseId}
                  setPulseId={setPulseId}
                  setPulseIdAvailable={setPulseIdAvailable}
                />
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-voicemate-red hover:bg-red-600"
                    onClick={proceedToSignup}
                    disabled={!pulseIdAvailable || pulseId.length < 3}
                  >
                    Claim Your PulseID <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <BenefitsList 
                title="Why reserve a PulseID?"
                benefits={benefits}
              />
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
