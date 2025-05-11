
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Inbox, Archive, Play, Send, User, Clock, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Mock data for received pulses
const mockReceivedPulses = [
  {
    id: '1',
    sender: 'John Doe',
    title: 'Project Update',
    timestamp: '2h ago',
    unread: true,
    duration: '1:24'
  },
  {
    id: '2',
    sender: 'Sarah Johnson',
    title: 'Meeting Followup',
    timestamp: '1d ago',
    unread: false,
    duration: '2:45'
  },
  {
    id: '3',
    sender: 'Michael Brown',
    title: 'Quick Question',
    timestamp: '2d ago',
    unread: false,
    duration: '0:58'
  }
];

// Mock data for archived pulses
const mockArchivedPulses = [
  {
    id: '4',
    sender: 'Alice Smith',
    title: 'Old Project Discussion',
    timestamp: '2w ago',
    duration: '3:12'
  },
  {
    id: '5',
    sender: 'Robert Lee',
    title: 'Previous Feedback',
    timestamp: '1m ago',
    duration: '1:47'
  }
];

interface PulseItemProps {
  pulse: {
    id: string;
    sender: string;
    title: string;
    timestamp: string;
    unread?: boolean;
    duration: string;
  };
  onPlay: (id: string) => void;
}

const PulseItem: React.FC<PulseItemProps> = ({ pulse, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-center p-4 rounded-lg mb-3 ${pulse.unread ? 'bg-voicemate-purple/10 border border-voicemate-purple/20' : 'bg-gray-900/50 border border-gray-800'}`}>
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-voicemate-card flex items-center justify-center border border-gray-700">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">{pulse.title}</h4>
              <p className="text-xs text-gray-400">{pulse.sender}</p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{pulse.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-xs text-gray-400 mr-3">
              <Mail className="h-3 w-3 mr-1" />
              <span>{pulse.duration}</span>
            </div>
            <div className="flex-grow"></div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 border-gray-700 hover:bg-voicemate-purple hover:text-white hover:border-transparent"
              onClick={() => onPlay(pulse.id)}
            >
              <Play className="h-3 w-3 mr-1" /> Play
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 text-gray-400 hover:text-white ml-1"
            >
              <Archive className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function InboxPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);
  
  const handlePlayPulse = (id: string) => {
    setSelectedPulseId(id);
    setIsPlaying(true);
    // In a real app, this would play the audio
    
    // For demo purposes, we'll just toggle the play state after 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading inbox...</p>
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
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Inbox</h1>
            <p className="text-muted-foreground mt-2">Manage your received voice messages</p>
          </div>
          <Button 
            className="bg-voicemate-red hover:bg-red-600 text-white mt-4 md:mt-0"
            onClick={() => navigate('/create')}
          >
            <Send className="mr-2 h-4 w-4" /> Send New Pulse
          </Button>
        </motion.div>
        
        <Card className="bg-voicemate-card border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Inbox className="mr-2 h-5 w-5 text-voicemate-purple" />
                  <span>Voice Messages</span>
                </CardTitle>
                <CardDescription>Listen and respond to your received pulses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="inbox" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6 bg-black/20 w-full md:w-[400px]">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inbox">
                {mockReceivedPulses.length > 0 ? (
                  <div>
                    {mockReceivedPulses.map((pulse) => (
                      <PulseItem 
                        key={pulse.id} 
                        pulse={pulse} 
                        onPlay={handlePlayPulse} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-voicemate-card p-4 rounded-full inline-block mb-4">
                      <Inbox className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your inbox is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any voice messages yet
                    </p>
                    <Button 
                      className="bg-voicemate-purple hover:bg-purple-700"
                      onClick={() => navigate('/dashboard')}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="archived">
                {mockArchivedPulses.length > 0 ? (
                  <div>
                    {mockArchivedPulses.map((pulse) => (
                      <PulseItem 
                        key={pulse.id} 
                        pulse={pulse} 
                        onPlay={handlePlayPulse} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-voicemate-card p-4 rounded-full inline-block mb-4">
                      <Archive className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No archived messages</h3>
                    <p className="text-muted-foreground">
                      You don't have any archived voice messages
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
