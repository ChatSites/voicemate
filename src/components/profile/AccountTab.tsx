
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AccountTabProps {
  profile: UserProfile | null;
}

const AccountTab: React.FC<AccountTabProps> = ({ profile }) => {
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordReset = () => {
    window.location.href = '/update-password';
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including your PulseID, voice messages, and profile information.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    
    // For now, we'll just show a toast. In a real implementation, you'd need to:
    // 1. Delete user data from all tables
    // 2. Delete the auth user
    // 3. Handle this through a secure server function
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion.",
      variant: "destructive"
    });
    
    setIsDeleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-voicemate-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Password</h4>
            <p className="text-sm text-muted-foreground">
              Change your account password to keep your account secure.
            </p>
            <Button 
              onClick={handlePasswordReset}
              variant="outline"
              className="border-gray-700"
            >
              Change Password
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Account Created</h4>
            <p className="text-sm text-muted-foreground">
              Your account was created and is actively being used for VoiceMate services.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-voicemate-card border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-red-400">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your VoiceMate account and all associated data. This action cannot be undone.
            </p>
            <div className="p-3 bg-red-950 border border-red-800 rounded-md">
              <p className="text-sm text-red-200">
                <strong>Warning:</strong> Deleting your account will:
              </p>
              <ul className="text-sm text-red-200 mt-2 space-y-1">
                <li>• Permanently delete your PulseID (@{profile?.pulse_id})</li>
                <li>• Remove all your voice messages and transcripts</li>
                <li>• Delete your profile and account information</li>
                <li>• Make your PulseID unavailable for future use</li>
              </ul>
            </div>
            <Button 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Processing...' : 'Delete Account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AccountTab;
