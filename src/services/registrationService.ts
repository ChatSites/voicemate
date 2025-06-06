
import { supabase } from '@/integrations/supabase/client';

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
) => {
  console.log('=== STARTING REGISTRATION ===');
  console.log('Registration attempt for:', { email, pulseId, fullName });

  try {
    // Clean up any existing auth state first
    console.log('Cleaning up existing auth state...');
    await supabase.auth.signOut();

    console.log('Proceeding with registration...');

    // Attempt registration with Supabase Auth
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

    console.log('Supabase signUp response:', { 
      user: data.user ? 'created' : 'none', 
      session: data.session ? 'active' : 'none',
      error: error?.message 
    });

    if (error) {
      console.error('Supabase registration error:', error);
      
      // Handle specific error cases
      if (error.message.includes('already registered') || 
          error.message.includes('already exists') ||
          error.message.includes('User already registered')) {
        return {
          success: false,
          error: new Error('This email is already registered. Please sign in instead.')
        };
      }
      
      // Handle PulseID conflicts
      if (error.message.includes('unique') || error.message.includes('duplicate')) {
        return {
          success: false,
          error: new Error('This PulseID or email is already taken. Please choose another.'),
          pulseIdAvailable: false,
          pulseIdSuggestions: [
            `${pulseId}${Math.floor(Math.random() * 1000)}`,
            `${pulseId}_${Date.now().toString().slice(-4)}`,
            `${pulseId}123`
          ]
        };
      }
      
      return {
        success: false,
        error: new Error(error.message)
      };
    }

    if (!data.user) {
      console.error('No user created in response');
      return {
        success: false,
        error: new Error('Registration failed - no user created')
      };
    }

    console.log('User created successfully:', data.user.id);

    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if the user profile was created in our database
    console.log('Checking if user profile was created...');
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError && !profileError.message.includes('Row not found')) {
        console.error('Profile check error:', profileError);
      } else if (userProfile) {
        console.log('User profile created successfully:', userProfile);
      } else {
        console.log('User profile not yet created, but registration succeeded');
      }
    } catch (profileCheckError) {
      console.log('Profile check failed, but continuing with registration...');
    }

    // Determine if email confirmation is needed
    const needsEmailConfirmation = !data.session;
    
    if (needsEmailConfirmation) {
      console.log('Email confirmation required');
    } else {
      console.log('User immediately confirmed');
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmNeeded: needsEmailConfirmation
    };

  } catch (error: any) {
    console.error('=== REGISTRATION EXCEPTION ===', error);
    return {
      success: false,
      error: new Error(error.message || 'Registration failed due to unexpected error')
    };
  }
};

export const finalEmailCheck = async (email: string): Promise<boolean> => {
  return !!email && email.includes('@');
};

export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  return !!id && id.length >= 3;
};
