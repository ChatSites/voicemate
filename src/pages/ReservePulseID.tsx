
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
import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

const ReservePulseID = () => {
  const [pulseId, setPulseId] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 ${isDark ? 'opacity-10' : 'opacity-5'}`}></div>
      
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <a href="/" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red`}>VoiceMate</a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`${isDark ? 'border-gray-800 bg-voicemate-card/60' : 'border-gray-200 bg-white'} backdrop-blur-md shadow-lg`}>
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
                    className="w-full bg-voicemate-red hover:bg-red-600 text-white flex items-center justify-center"
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
        
        <div className="mt-6 text-center">
          <a href="/" className={`text-sm ${isDark ? 'text-voicemate-purple hover:text-voicemate-red' : 'text-purple-600 hover:text-red-500'} transition-colors`}>
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservePulseID;
