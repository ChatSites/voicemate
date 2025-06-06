
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';

// Basic email format check
export const finalEmailCheck = async (email: string): Promise<boolean> => {
  return !!email && email.includes('@');
};

// Basic PulseID format check
export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  return !!id && id.length >= 3;
};

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
): Promise<{
  success: boolean;
  error?: Error;
  pulseIdAvailable?: boolean;
  pulseIdSuggestions?: string[];
  user?: any;
  session?: any;
  emailConfirmNeeded?: boolean;
}> => {
  console.log('=== REGISTRATION PROCESS START ===');
  console.log('Registration attempt:', { fullName, email, pulseId, passwordLength: password.length });

  try {
    // Clean up any existing auth state
    console.log('Cleaning up existing auth state...');
    cleanupAuthState();

    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch {
      console.log('No existing session to sign out');
    }

    // Check PulseID availability
    console.log('Checking PulseID availability...');
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id')
      .or(`pulse_id.eq.${pulseId},name.eq.${pulseId}`)
      .limit(1);

    if (pulseIdError) {
      console.error('Error checking PulseID:', pulseIdError);
    }

    if (existingPulseId && existingPulseId.length > 0) {
      console.log(`PulseID ${pulseId} is already taken`);
      const pulseIdSuggestions = [
        `${pulseId}_${Math.floor(Math.random() * 1000)}`,
        `${pulseId}.${Date.now().toString().slice(-4)}`,
        `${pulseId}123`,
      ];

      return {
        success: false,
        pulseIdAvailable: false,
        pulseIdSuggestions,
        error: new Error('PulseID is already taken'),
      };
    }

    // Attempt Supabase Auth registration
    console.log('Calling Supabase auth.signUp...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId,
        },
      },
    });

    if (authError) {
      console.error('Auth registration error:', authError);

      if (authError?.status === 400 && authError?.message?.toLowerCase().includes('user already registered')) {
        return {
          success: false,
          error: new Error('This email was previously used. Please try logging in or use a different email.'),
        };
      }

      return {
        success: false,
        error: new Error(authError?.message || 'Registration failed'),
      };
    }

    console.log('Auth registration successful:', {
      userId: authData.user?.id,
      hasSession: !!authData.session,
      emailConfirmed: authData.user?.email_confirmed_at ? 'YES' : 'NO',
    });

    // Wait for possible trigger to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let profileCreated = false;

    if (authData.user?.id) {
      console.log('Checking if profile was created by trigger...');
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileCheckError) {
        console.log('Profile check error (may be expected):', profileCheckError);
      }

      profileCreated = !!existingProfile;
      console.log('Profile created by trigger:', profileCreated);
    }

    // Manually create profile if trigger didn't
    if (!profileCreated && authData.user?.id) {
      console.log('Creating profile manually...');
      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email,
          });

        if (profileError) {
          console.error('Manual profile creation failed:', profileError);
        } else {
          console.log('Profile created manually');
        }
      } catch (err) {
        console.error('Error creating profile manually:', err);
      }
    }

    if (authData.session) {
      console.log('User logged in immediately');
      return {
        success: true,
        user: authData.user,
        session: authData.session,
        emailConfirmNeeded: false,
      };
    } else {
      console.log('Email confirmation required');
      return {
        success: true,
        user: authData.user,
        session: null,
        emailConfirmNeeded: true,
      };
    }
  } catch (error: any) {
    console.error('=== REGISTRATION PROCESS ERROR ===', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(error?.message || 'Unknown registration error'),
    };
  }
};
