
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Hash, 
  Settings, 
  Shield, 
  BookOpen,
  ExternalLink 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'pulseid', label: 'PulseID', icon: Hash },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Settings
          </h3>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-voicemate-purple text-white'
                    : 'hover:bg-gray-800 text-muted-foreground hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      <Card className="bg-voicemate-card border-gray-800">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Help & Resources
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-muted-foreground hover:text-white hover:bg-gray-800"
            onClick={() => navigate('/profile/how-it-works')}
          >
            <BookOpen className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">How It Works</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSidebar;
