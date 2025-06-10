
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HowItWorksCard: React.FC = () => {
  const navigate = useNavigate();

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
          <p className="text-muted-foreground">
            Learn how to use VoiceMate
          </p>

          <Button 
            onClick={() => navigate('/how-it-works')}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HowItWorksCard;
