
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

    // Wait a bit longer for the trigger to complete and create the profile
    console.log('Waiting for database trigger to create user profile...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify that the user profile was created in our database
    console.log('Verifying user profile creation...');
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.log('Profile verification error:', profileError);
        // Don't fail registration if profile check fails
      } else if (userProfile) {
        console.log('User profile verified successfully:', userProfile);
      } else {
        console.log('User profile not found yet, but registration was successful');
        // The trigger might still be processing, this is okay
      }
    } catch (profileCheckError) {
      console.log('Profile verification failed, but continuing with registration...', profileCheckError);
    }

    // Determine if email confirmation is needed
    const needsEmailConfirmation = !data.session;
    
    if (needsEmailConfirmation) {
      console.log('Email confirmation required');
    } else {
      console.log('User immediately confirmed and logged in');
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
