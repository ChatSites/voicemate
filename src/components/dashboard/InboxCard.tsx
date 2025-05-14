
import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InboxCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Inbox</span>
            <Inbox className="text-voicemate-purple" />
          </CardTitle>
          <CardDescription>Your received messages</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Check and manage voice messages sent to you.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 w-full"
            onClick={() => navigate('/inbox')}
          >
            View Inbox
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InboxCard;
