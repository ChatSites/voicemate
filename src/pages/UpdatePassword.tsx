
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Update Password | VoiceMate ID';
    
    // Log params for debugging
    console.log('UpdatePassword params:', 
      Object.fromEntries(searchParams.entries()),
      'hash:', location.hash
    );
  }, [searchParams, location.hash]);

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validatePassword();
    if (error) {
      toast({
        title: "Password Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Extract token from params or hash
      const token = searchParams.get('access_token') || 
                    new URLSearchParams(location.hash.replace('#', '?')).get('access_token');
      
      let updateResult;
      
      if (token) {
        // If we have a token, use it for password reset
        console.log('Updating password with token');
        updateResult = await supabase.auth.updateUser({ 
          password,
        }, {
          accessToken: token
        });
      } else {
        // Regular password update (user already authenticated)
        console.log('Updating password without token');
        updateResult = await supabase.auth.updateUser({ password });
      }
      
      const { error } = updateResult;
      
      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      navigate('/auth?tab=login');
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error?.message || "An error occurred while updating your password.",
        variant: "destructive",
      });
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for access token to ensure user came from a reset link
  const hasAccessToken = searchParams.get('access_token') !== null || 
                          location.hash.includes('access_token=');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Update Password</CardTitle>
            <CardDescription className="text-center">Create a new password for your account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!hasAccessToken && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Invalid or expired password reset link. Please request a new password reset.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/30 border-gray-700 pr-10"
                    placeholder="••••••••"
                    disabled={loading || !hasAccessToken}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-black/30 border-gray-700"
                  placeholder="••••••••"
                  disabled={loading || !hasAccessToken}
                  required
                />
              </div>
              
              <div className="text-sm text-gray-400">
                Password must be at least 8 characters long
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
                disabled={loading || !hasAccessToken}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
              
              <Button 
                type="button" 
                variant="link" 
                className="mt-2 text-voicemate-purple"
                onClick={() => navigate('/auth')}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;
