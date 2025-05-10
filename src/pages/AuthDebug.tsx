
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const AuthDebug = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authKeys, setAuthKeys] = useState<string[]>([]);

  useEffect(() => {
    // Get current session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    // Collect all auth-related keys from storage
    const collectAuthKeys = () => {
      const keys: string[] = [];
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          keys.push(key);
        }
      });
      setAuthKeys(keys);
    };

    checkSession();
    collectAuthKeys();

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event);
      setSession(currentSession);
      collectAuthKeys();
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearAuthState = () => {
    cleanupAuthState();
    window.location.reload();
  };

  const signOutGlobally = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate Auth Debug</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Authentication Debug</CardTitle>
            <CardDescription>Troubleshoot authentication issues</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Session Status</h3>
              {loading ? (
                <p>Loading...</p>
              ) : session ? (
                <div className="space-y-2">
                  <div className="bg-green-900/20 p-3 rounded-md border border-green-500">
                    <p className="text-green-400">User is logged in</p>
                  </div>
                  <p className="text-sm text-gray-400">User ID: {session.user.id}</p>
                  <p className="text-sm text-gray-400">Email: {session.user.email}</p>
                </div>
              ) : (
                <div className="bg-amber-900/20 p-3 rounded-md border border-amber-500">
                  <p className="text-amber-400">No active session</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Auth Storage Keys</h3>
              {authKeys.length > 0 ? (
                <div className="bg-black/30 p-3 rounded-md border border-gray-700 max-h-40 overflow-y-auto">
                  {authKeys.map((key) => (
                    <p key={key} className="text-xs text-gray-400">{key}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No auth keys found in storage</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={clearAuthState}>
                  Clear Auth State
                </Button>
                <Button variant="outline" onClick={signOutGlobally} className="bg-red-900/20 hover:bg-red-900/30">
                  Sign Out Globally
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/auth'} className="bg-blue-900/20 hover:bg-blue-900/30">
                  Go to Auth Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDebug;
