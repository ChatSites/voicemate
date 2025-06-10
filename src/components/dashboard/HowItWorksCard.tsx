
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserPlus, Share2, Inbox, Mic, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HowItWorksCard: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <UserPlus className="w-4 h-4 text-voicemate-purple" />,
      title: "Set Up Your Profile",
      description: "Complete your profile and get your unique PulseID"
    },
    {
      icon: <Share2 className="w-4 h-4 text-blue-400" />,
      title: "Share Your PulseID",
      description: "Share your link instead of your phone number"
    },
    {
      icon: <Mic className="w-4 h-4 text-red-400" />,
      title: "Receive Voice Messages",
      description: "Others can leave you voice messages anytime"
    },
    {
      icon: <Inbox className="w-4 h-4 text-voicemate-purple" />,
      title: "Manage Your Inbox",
      description: "AI transcribes and organizes all messages"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-voicemate-card border-gray-800 hover:border-blue-500/50 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              How It Works
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-voicemate-card border border-gray-700 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h4 className="text-sm font-medium truncate">{step.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">AI Features</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Auto-transcription & analysis</li>
              <li>• Smart reply suggestions</li>
              <li>• Message intent understanding</li>
            </ul>
          </div>

          <Button 
            onClick={() => navigate('/how-it-works-profile')}
            className="w-full bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Complete Guide
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HowItWorksCard;
