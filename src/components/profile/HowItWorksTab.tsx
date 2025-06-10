
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  UserPlus, 
  Share2, 
  Inbox, 
  Mic, 
  Brain, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Settings,
  Bell
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const HowItWorksTab: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Quick Navigation */}
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection('setup-profile')}
              className="border-gray-700 text-sm"
            >
              Setup Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection('share-pulseid')}
              className="border-gray-700 text-sm"
            >
              Share PulseID
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection('manage-messages')}
              className="border-gray-700 text-sm"
            >
              Manage Messages
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToSection('send-voice')}
              className="border-gray-700 text-sm"
            >
              Send Voice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Setting up Your Profile */}
      <Card id="setup-profile" className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-voicemate-purple" />
            Step 1: Setting Up Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Complete Your Profile Information</h4>
                <p className="text-sm text-muted-foreground">
                  Go to the "Profile" tab and update your display name. This is how others will see you when you send voice messages.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Understand Your PulseID</h4>
                <p className="text-sm text-muted-foreground">
                  Your PulseID is your unique identifier (like @username). It's permanent and cannot be changed, so make sure you're happy with it.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-voicemate-purple mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Configure Preferences</h4>
                <p className="text-sm text-muted-foreground">
                  Visit the "Preferences" tab to set up notifications, theme, and voice message settings like auto-transcription.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Sharing Your PulseID */}
      <Card id="share-pulseid" className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-voicemate-purple" />
            Step 2: Sharing Your PulseID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Copy className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Get Your PulseID URL</h4>
                <p className="text-sm text-muted-foreground">
                  In the "PulseID" tab, you'll find your unique URL (https://voicemate.id/pulse/your-id). Copy this link to share with others.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Share with Contacts</h4>
                <p className="text-sm text-muted-foreground">
                  Send your PulseID URL via email, text, social media, or any messaging platform. Anyone with this link can send you voice messages.
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-950 border border-blue-800 rounded-md">
              <p className="text-sm text-blue-200">
                <strong>Pro Tip:</strong> Add your PulseID URL to your email signature, business card, or social media bio for easy access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Managing Incoming Messages */}
      <Card id="manage-messages" className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-voicemate-purple" />
            Step 3: Managing Incoming Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Receiving Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  When someone sends you a voice message, you'll receive notifications (if enabled in Preferences). Messages appear in your Inbox.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Viewing Messages</h4>
                <p className="text-sm text-muted-foreground">
                  Access your Inbox from the dashboard or navigation menu. Listen to voice messages and read auto-generated transcripts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Replying to Messages</h4>
                <p className="text-sm text-muted-foreground">
                  You can reply to voice messages with your own voice message directly from the message view.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Sending Voice Messages */}
      <Card id="send-voice" className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-voicemate-purple" />
            Step 4: Sending Voice Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Find Someone's PulseID</h4>
                <p className="text-sm text-muted-foreground">
                  Get the PulseID URL from someone (it looks like https://voicemate.id/pulse/their-id) or use the "Send Pulse" feature from your dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Record Your Message</h4>
                <p className="text-sm text-muted-foreground">
                  Click the record button, speak your message clearly, and click stop when finished. You can preview before sending.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Send Your Message</h4>
                <p className="text-sm text-muted-foreground">
                  Add an optional text message and click send. The recipient will receive your voice message in their inbox.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Understanding AI Features */}
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-voicemate-purple" />
            Step 5: Understanding AI Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Auto-Transcription</h4>
                <p className="text-sm text-muted-foreground">
                  VoiceMate automatically converts voice messages to text, making them searchable and accessible.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Message Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes voice messages to understand intent and can suggest appropriate responses or actions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Privacy Controls</h4>
                <p className="text-sm text-muted-foreground">
                  You can control which AI features are enabled for your account in the Preferences tab.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            Troubleshooting Common Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Microphone Not Working</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Check browser permissions for microphone access</li>
                <li>Ensure your microphone is not muted or being used by another app</li>
                <li>Try refreshing the page and granting permissions again</li>
              </ul>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Messages Not Sending</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Check your internet connection</li>
                <li>Verify the PulseID URL is correct</li>
                <li>Try recording a shorter message (under 5 minutes)</li>
              </ul>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Not Receiving Messages</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Check your notification settings in Preferences</li>
                <li>Verify your email settings if using email notifications</li>
                <li>Check your Inbox directly if notifications aren't working</li>
              </ul>
            </div>
            
            <div className="p-3 bg-orange-950 border border-orange-800 rounded-md">
              <p className="text-sm text-orange-200">
                <strong>Still having issues?</strong> Contact our support team with specific details about the problem you're experiencing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">Recording Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                <li>Speak clearly and at normal pace</li>
                <li>Record in a quiet environment</li>
                <li>Keep messages concise and focused</li>
                <li>Test your microphone before important messages</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">Privacy & Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                <li>Only share your PulseID with trusted contacts</li>
                <li>Review your privacy settings regularly</li>
                <li>Be mindful of sensitive information in voice messages</li>
                <li>Log out from shared devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HowItWorksTab;
