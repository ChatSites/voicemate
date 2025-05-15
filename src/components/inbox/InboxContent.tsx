
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox, Archive } from 'lucide-react';
import PulseItem from './PulseItem';
import EmptyState from './EmptyState';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

interface InboxContentProps {
  pulses: any[];
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPlayPulse: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  selectedPulses: string[];
}

const InboxContent: React.FC<InboxContentProps> = ({ 
  pulses, 
  loading,
  activeTab,
  setActiveTab,
  onPlayPulse, 
  onToggleSelect,
  onSelectAll, 
  selectedPulses 
}) => {
  const currentPulseIds = pulses.map(pulse => pulse.id);
  const areAllSelected = pulses.length > 0 && 
    pulses.every(pulse => selectedPulses.includes(pulse.id));
    
  return (
    <Card className="bg-voicemate-card border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {activeTab === 'inbox' ? (
                <Inbox className="mr-2 h-5 w-5 text-voicemate-purple" />
              ) : (
                <Archive className="mr-2 h-5 w-5 text-voicemate-purple" />
              )}
              <span>{activeTab === 'inbox' ? 'Voice Messages' : 'Archived Messages'}</span>
            </CardTitle>
            <CardDescription>
              {activeTab === 'inbox' ? 'Listen and respond to your received pulses' : 'Review your archived voice messages'}
            </CardDescription>
          </div>
          {pulses.length > 0 && !loading && (
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all"
                  checked={areAllSelected}
                  onCheckedChange={() => onSelectAll(currentPulseIds)}
                  className="data-[state=checked]:bg-voicemate-purple data-[state=checked]:border-voicemate-purple"
                />
                <label htmlFor="select-all" className="text-sm text-gray-400 cursor-pointer">
                  {areAllSelected ? 'Deselect All' : 'Select All'}
                </label>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            // Clear selections when switching tabs
            onSelectAll([]);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6 bg-black/20 w-full md:w-[400px]">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-3 w-1/2 bg-gray-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="inbox">
                {pulses.length > 0 ? (
                  <div>
                    {pulses.map((pulse) => (
                      <PulseItem 
                        key={pulse.id} 
                        pulse={{
                          id: pulse.id,
                          sender: pulse.pulse_id || 'Anonymous',
                          title: pulse.intent || 'No Title',
                          timestamp: new Date(pulse.created_at).toLocaleDateString(),
                          unread: false, // We could add this field later
                          duration: '1:30', // This would need to be calculated from the audio
                          audio_url: pulse.audio_url
                        }} 
                        onPlay={onPlayPulse}
                        onToggleSelect={onToggleSelect}
                        isSelected={selectedPulses.includes(pulse.id)} 
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="inbox" />
                )}
              </TabsContent>
              
              <TabsContent value="archived">
                {pulses.length > 0 ? (
                  <div>
                    {pulses.map((pulse) => (
                      <PulseItem 
                        key={pulse.id} 
                        pulse={{
                          id: pulse.id,
                          sender: pulse.pulse_id || 'Anonymous',
                          title: pulse.intent || 'No Title',
                          timestamp: new Date(pulse.created_at).toLocaleDateString(),
                          duration: '1:30', // This would need to be calculated from the audio
                          audio_url: pulse.audio_url
                        }} 
                        onPlay={onPlayPulse}
                        onToggleSelect={onToggleSelect}
                        isSelected={selectedPulses.includes(pulse.id)} 
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="archived" />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InboxContent;
