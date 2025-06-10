
import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UserManagementCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-voicemate-card border-gray-800 hover:border-voicemate-purple/50 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-voicemate-purple" />
              User Management
            </div>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Monitor user registrations and profile creation status. Identify any issues with the registration process.
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Complete profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Missing profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Unconfirmed emails</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Active users</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/admin/users')}
            className="w-full bg-voicemate-purple hover:bg-purple-700"
          >
            <User className="w-4 h-4 mr-2" />
            View All Users
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserManagementCard;
