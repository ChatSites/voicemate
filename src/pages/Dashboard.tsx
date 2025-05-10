
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Inbox, Send, PieChart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.name || 'User'}</h1>
          <p className="text-muted-foreground mt-2">Manage your voice messages and interactions</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pulse Stats Card */}
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
          
          {/* Send Pulse Card */}
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
          
          {/* Inbox Card */}
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
        </div>
        
        {/* Recent Activity */}
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
                  onClick={() => navigate('/create')}
                >
                  Create Your First Pulse
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
