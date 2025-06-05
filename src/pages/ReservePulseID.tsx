
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import PulseIdInput from '@/components/reserve/PulseIdInput';
import BenefitsList from '@/components/reserve/BenefitsList';
import PulseIdHeader from '@/components/reserve/PulseIdHeader';
import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { forceRefreshNextCheck } from '@/services/pulseIdService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const ReservePulseID = () => {
  const [pulseId, setPulseId] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const [pulseIdChecks, setPulseIdChecks] = useState(0);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Show welcome toast on initial render with a delay to ensure context is available
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        toast({
          title: "Welcome to PulseID Reservation",
          description: "Enter a PulseID to check its availability",
        });
      } catch (err) {
        console.error("Failed to show welcome toast:", err);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const claimPulseId = () => {
    if (pulseIdAvailable && pulseId.length >= 3) {
      console.log(`Claiming PulseID: ${pulseId}`);
      // Navigate to auth page with register tab and prefilled PulseID
      navigate(`/auth?tab=register&pulseId=${encodeURIComponent(pulseId)}`);
    } else {
      try {
        toast({
          title: "Check availability first",
          description: "Please verify that your PulseID is available before proceeding",
          variant: "destructive",
        });
      } catch (err) {
        console.error("Failed to show error toast:", err);
        alert("Please verify that your PulseID is available before proceeding");
      }
    }
  };

  const refreshAllChecks = () => {
    forceRefreshNextCheck();
    setPulseIdChecks(prev => prev + 1);
    try {
      toast({
        title: "Refresh triggered",
        description: "All caches have been cleared for fresh availability checks",
      });
    } catch (err) {
      console.error("Failed to show refresh toast:", err);
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
              {pulseIdChecks > 2 && (
                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-xs">
                    If availability checks are inconsistent, try refreshing or waiting a moment before proceeding.
                  </AlertDescription>
                </Alert>
              )}
              
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
                    onClick={claimPulseId}
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
              
              <div className="flex justify-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1 text-gray-400 hover:text-gray-300"
                  onClick={refreshAllChecks}
                >
                  <RefreshCw className="h-3 w-3" /> Force refresh all checks
                </Button>
              </div>
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
