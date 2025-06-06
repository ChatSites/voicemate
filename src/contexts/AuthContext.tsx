
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the session state
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      console.log('Session refreshed:', data.session ? 'yes' : 'no');
      setSession(data.session);
      setUser(data.session?.user ?? null);
      return data.session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Error during global sign out:', err);
      }
      
      // Clear state
      setSession(null);
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Setting up AuthContext...');
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession ? 'has session' : 'no session');
            
            if (!mounted) return;
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
            
            if (event === 'SIGNED_IN' && currentSession?.user) {
              console.log('User signed in successfully');
              toast({
                title: "Signed in successfully",
                description: "Welcome back!"
              });
            }
          }
        );

        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        console.log('Got existing session:', data.session ? 'yes' : 'no');
        
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error in auth setup:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setupAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  console.log('AuthContext state:', { 
    hasUser: !!user, 
    isLoading: loading, 
    userEmail: user?.email,
    sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none',
  });

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};
