
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PulseStatsCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Pulses</span>
            <PieChart className="text-voicemate-purple" />
          </CardTitle>
          <CardDescription>Your voice message statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sent</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Listen Rate</span>
              <span className="font-semibold">0%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Response Rate</span>
              <span className="font-semibold">0%</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="p-0 text-voicemate-purple" onClick={() => navigate('/analytics')}>
            View Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PulseStatsCard;
