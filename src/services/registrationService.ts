
import { supabase } from '@/integrations/supabase/client';

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
) => {
  console.log('Starting registration for:', { email, pulseId, fullName });

  try {
    // First, clean up any existing incomplete registrations
    console.log('Cleaning up any existing auth state...');
    await supabase.auth.signOut();
    
    // Check if PulseID is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('pulse_id', pulseId)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: new Error('PulseID is already taken'),
        pulseIdAvailable: false,
        pulseIdSuggestions: [
          `${pulseId}${Math.floor(Math.random() * 1000)}`,
          `${pulseId}_${Date.now().toString().slice(-4)}`,
          `${pulseId}123`
        ]
      };
    }

    // Register with Supabase Auth with explicit email confirmation
    console.log('Attempting registration with Supabase...');
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

    if (error) {
      console.error('Supabase registration error:', error);
      
      // Handle specific error cases
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return {
          success: false,
          error: new Error('This email is already registered. Please sign in instead.')
        };
      }
      
      return {
        success: false,
        error: new Error(error.message)
      };
    }

    console.log('Registration response:', data);

    // If user was created but no session, they need email confirmation
    if (data.user && !data.session) {
      console.log('User created, email confirmation required');
      
      // Try to manually create the user profile since trigger might not be working
      try {
        console.log('Attempting to create user profile manually...');
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail registration if profile creation fails
        } else {
          console.log('User profile created successfully');
        }
      } catch (profileErr) {
        console.error('Profile creation exception:', profileErr);
        // Continue anyway
      }
      
      return {
        success: true,
        user: data.user,
        session: data.session,
        emailConfirmNeeded: true
      };
    }

    // If we have a session, user is immediately confirmed
    if (data.session) {
      console.log('User registered and confirmed immediately');
      return {
        success: true,
        user: data.user,
        session: data.session,
        emailConfirmNeeded: false
      };
    }

    // Fallback case
    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmNeeded: !data.session
    };

  } catch (error: any) {
    console.error('Registration failed with exception:', error);
    return {
      success: false,
      error: new Error(error.message || 'Registration failed')
    };
  }
};

export const finalEmailCheck = async (email: string): Promise<boolean> => {
  return !!email && email.includes('@');
};

export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  return !!id && id.length >= 3;
};
