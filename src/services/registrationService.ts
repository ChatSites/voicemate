
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
      user: data.user ? `created with ID: ${data.user.id}` : 'none', 
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
    console.log('User metadata sent:', data.user.user_metadata);

    // Give the database trigger time to complete
    console.log('Waiting for database trigger to create user profile...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify that the user profile was created in our database
    console.log('Verifying user profile creation...');
    let profileCreated = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!profileCreated && attempts < maxAttempts) {
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, name, pulse_id, email, created_at')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.log(`Profile verification attempt ${attempts + 1} error:`, profileError);
        } else if (userProfile) {
          console.log('User profile verified successfully:', userProfile);
          profileCreated = true;
        } else {
          console.log(`Profile verification attempt ${attempts + 1}: Profile not found yet`);
        }
      } catch (profileCheckError) {
        console.log(`Profile verification attempt ${attempts + 1} exception:`, profileCheckError);
      }

      if (!profileCreated && attempts < maxAttempts - 1) {
        console.log(`Waiting 1 second before retry...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }

    if (!profileCreated) {
      console.warn('Profile was not created by trigger within expected time, but registration was successful');
      // Don't fail the registration - the profile should be available via the useUserProfile fallback
    } else {
      console.log('Profile creation confirmed!');
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
      emailConfirmNeeded: needsEmailConfirmation,
      profileCreated
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
