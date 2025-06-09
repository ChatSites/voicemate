
import { supabase } from '@/integrations/supabase/client';
import { isPulseIdTaken, clearAllPulseIdCaches } from '@/integrations/supabase/client';

export interface RegistrationResult {
  success: boolean;
  user?: any;
  session?: any;
  emailConfirmNeeded?: boolean;
  pulseIdAvailable?: boolean;
  pulseIdSuggestions?: string[];
  error?: {
    message: string;
  };
}

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
): Promise<RegistrationResult> => {
  try {
    console.log('Registration service: Starting registration process');
    console.log('Registration data:', { fullName, email, pulseId, passwordLength: password.length });

    // First, validate that the PulseID is still available
    console.log('Registration service: Checking PulseID availability');
    const pulseIdTaken = await isPulseIdTaken(pulseId);
    
    if (pulseIdTaken) {
      console.log('Registration service: PulseID is taken');
      // Generate suggestions
      const suggestions = generatePulseIdSuggestions(pulseId);
      return {
        success: false,
        pulseIdAvailable: false,
        pulseIdSuggestions: suggestions,
        error: {
          message: 'PulseID is already taken'
        }
      };
    }

    console.log('Registration service: PulseID is available, proceeding with registration');

    // Attempt to register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    console.log('Registration service: Supabase response received', {
      hasUser: !!data.user,
      hasSession: !!data.session,
      error: error?.message
    });

    if (error) {
      console.error('Registration service: Supabase error:', error);
      
      // Handle specific error cases
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return {
          success: false,
          error: {
            message: 'This email is already registered. Please log in instead.'
          }
        };
      }
      
      return {
        success: false,
        error: {
          message: error.message
        }
      };
    }

    if (!data.user) {
      console.error('Registration service: No user returned from Supabase');
      return {
        success: false,
        error: {
          message: 'Registration failed - no user created'
        }
      };
    }

    console.log('Registration service: User created successfully');
    
    // Clear PulseID caches since we've successfully registered
    clearAllPulseIdCaches();

    // Check if email confirmation is needed
    const emailConfirmNeeded = !data.session;

    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmNeeded
    };

  } catch (error: any) {
    console.error('Registration service: Unexpected error:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'An unexpected error occurred during registration'
      }
    };
  }
};

const generatePulseIdSuggestions = (originalPulseId: string): string[] => {
  const suggestions: string[] = [];
  const base = originalPulseId.toLowerCase();
  
  // Add numbers
  for (let i = 1; i <= 5; i++) {
    suggestions.push(`${base}${i}`);
  }
  
  // Add common suffixes
  const suffixes = ['_', 'x', '2024', 'new'];
  suffixes.forEach(suffix => {
    suggestions.push(`${base}${suffix}`);
  });
  
  return suggestions.slice(0, 5); // Return top 5 suggestions
};
