
import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SendPulseCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Send Pulse</span>
            <Send className="text-voicemate-red" />
          </CardTitle>
          <CardDescription>Create a new voice message</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Record and send a new voice message to share with others.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="bg-voicemate-red hover:bg-red-600 text-white w-full"
            onClick={() => navigate('/create')}
          >
            Create New Pulse
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SendPulseCard;
