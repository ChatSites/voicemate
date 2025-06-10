
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentActivityCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="bg-voicemate-card border-gray-800 hover:border-blue-500/50 transition-colors">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No recent activities yet. Start by sending a Pulse!
            </p>
            <Button 
              className="bg-voicemate-purple hover:bg-purple-700"
              onClick={() => navigate('/send-pulse')}
              size="sm"
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
