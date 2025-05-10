
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox } from 'lucide-react';
import PulseItem from './PulseItem';
import EmptyState from './EmptyState';

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

interface InboxContentProps {
  onPlayPulse: (id: string) => void;
}

const InboxContent: React.FC<InboxContentProps> = ({ onPlayPulse }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  
  return (
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
                    onPlay={onPlayPulse} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="inbox" />
            )}
          </TabsContent>
          
          <TabsContent value="archived">
            {mockArchivedPulses.length > 0 ? (
              <div>
                {mockArchivedPulses.map((pulse) => (
                  <PulseItem 
                    key={pulse.id} 
                    pulse={pulse} 
                    onPlay={onPlayPulse} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="archived" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InboxContent;
