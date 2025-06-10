
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
    console.log('=== REGISTRATION SERVICE START ===');
    console.log('Registration data:', { fullName, email, pulseId, passwordLength: password.length });

    // First, validate that the PulseID is still available
    console.log('Registration service: Checking PulseID availability');
    const pulseIdTaken = await isPulseIdTaken(pulseId);
    
    if (pulseIdTaken) {
      console.log('Registration service: PulseID is taken');
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
    console.log('Registration service: Calling supabase.auth.signUp...');
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
      userId: data.user?.id,
      userEmail: data.user?.email,
      userConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'unconfirmed',
      userMetadata: data.user?.user_metadata,
      error: error?.message
    });

    if (error) {
      console.error('Registration service: Supabase error:', error);
      
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

    console.log('Registration service: User created successfully with ID:', data.user.id);
    
    // Clear PulseID caches since we've successfully registered
    clearAllPulseIdCaches();

    // Check if email confirmation is needed (this is the normal flow)
    const emailConfirmNeeded = !data.user.email_confirmed_at;
    
    console.log('Registration service: Email confirmation needed?', emailConfirmNeeded);

    // Wait a moment for the trigger to potentially run
    console.log('Registration service: Waiting 2 seconds for database trigger to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if profile was created by the trigger
    console.log('Registration service: Checking if profile was created by trigger...');
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('id, name, pulse_id, email')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Registration service: Error checking profile creation:', profileError);
      } else if (profileData) {
        console.log('Registration service: Profile successfully created by trigger:', profileData);
      } else {
        console.warn('Registration service: Profile not found after trigger should have run');
        
        // Try to manually create the profile as fallback
        console.log('Registration service: Attempting manual profile creation as fallback...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email
          });

        if (insertError) {
          console.error('Registration service: Manual profile creation failed:', insertError);
        } else {
          console.log('Registration service: Manual profile creation succeeded');
        }
      }
    } catch (profileCheckError) {
      console.error('Registration service: Unexpected error during profile check:', profileCheckError);
    }

    console.log('=== REGISTRATION SERVICE SUCCESS ===');
    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmNeeded
    };

  } catch (error: any) {
    console.error('=== REGISTRATION SERVICE ERROR ===', error);
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
  
  return suggestions.slice(0, 5);
};
