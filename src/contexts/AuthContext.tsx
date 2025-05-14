
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out (fallback if it fails)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Clear any toast notifications
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Signed in successfully",
              description: "Welcome back!"
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out"
            });
          } else if (event === 'USER_UPDATED') {
            toast({
              title: "Account updated",
              description: "Your account information has been updated"
            });
          }
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      );

      // THEN check for existing session
      const { data } = await supabase.auth.getSession();
      console.log('Got existing session:', data.session ? 'yes' : 'no');
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  console.log('AuthContext state:', { hasUser: !!user, isLoading: loading });

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
