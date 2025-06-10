
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileErrorProps {
  error: string;
}

const ProfileError: React.FC<ProfileErrorProps> = ({ error }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <Card className="bg-voicemate-card border-red-800">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="border-gray-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileError;
