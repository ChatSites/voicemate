
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentActivityCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12"
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No recent activities yet. Start by sending a Pulse!
            </p>
            <Button 
              className="mt-4 bg-voicemate-purple hover:bg-purple-700"
              onClick={() => navigate('/send-pulse')}
            >
              Create Your First Pulse
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivityCard;
