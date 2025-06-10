
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Moon, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/providers/ThemeProvider';

const PreferencesTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoTranscribe, setAutoTranscribe] = useState(true);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Appearance</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label htmlFor="theme-toggle">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Receive email notifications when you get new voice messages.
              </p>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications for new messages.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Voice Messages</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-transcribe">Auto-transcribe messages</Label>
              <Switch
                id="auto-transcribe"
                checked={autoTranscribe}
                onCheckedChange={setAutoTranscribe}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically generate text transcriptions for incoming voice messages.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PreferencesTab;
