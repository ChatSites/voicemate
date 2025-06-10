
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProfileCard: React.FC = () => {
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
            <span>Profile & Settings</span>
            <Settings className="text-voicemate-purple" />
          </CardTitle>
          <CardDescription>Manage your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Update your profile information, manage your PulseID settings, and configure your preferences.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="bg-voicemate-purple hover:bg-purple-700 text-white w-full hover:text-white"
            onClick={() => navigate('/profile')}
          >
            <User className="w-4 h-4 mr-2" />
            Open Profile Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
