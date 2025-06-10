
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Inbox, User, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Send Pulse',
      description: 'Create a new voice message',
      icon: Send,
      action: () => navigate('/send-pulse'),
      color: 'bg-voicemate-red',
      hoverColor: 'hover:bg-red-600'
    },
    {
      title: 'View Inbox',
      description: 'Check received messages',
      icon: Inbox,
      action: () => navigate('/inbox'),
      color: 'bg-voicemate-purple',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your profile',
      icon: User,
      action: () => navigate('/profile'),
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700'
    }
  ];

  const stats = [
    { label: 'Pulses Sent', value: '0', icon: Send },
    { label: 'Messages Received', value: '0', icon: Inbox },
    { label: 'Listen Rate', value: '0%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-voicemate-card border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group" onClick={action.action}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${action.color} group-hover:${action.hoverColor} transition-colors`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-voicemate-card border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-voicemate-purple" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-voicemate-card border-gray-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Get Started</h3>
            <p className="text-muted-foreground mb-6">
              Ready to send your first voice message? Create a Pulse and share it with others.
            </p>
            <Button 
              className="bg-voicemate-purple hover:bg-purple-700"
              onClick={() => navigate('/send-pulse')}
            >
              <Send className="w-4 h-4 mr-2" />
              Create Your First Pulse
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
