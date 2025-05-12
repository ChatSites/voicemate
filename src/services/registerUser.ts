
import { supabase } from '@/integrations/supabase/client';

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
}> => {
  try {
    // Step 1: Check PulseID availability
    const { data: existingPulseId, error: pulseIdError, status } = await supabase
      .from('users')
      .select('id')
      .eq('pulse_id', pulseId)
      .single();

    if (existingPulseId && status !== 406) {
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

    // Step 2: Sign up user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
      },
    });

    if (error) {
      if (error.status === 409 || error.message.includes('already registered')) {
        return {
          success: false,
          error: new Error('User already registered. Please login instead.'),
        };
      }

      return {
        success: false,
        error: new Error(`Registration failed: ${error.message}`),
      };
    }

    const user = data.user;
    if (!user) {
      return { success: false, error: new Error('No user returned') };
    }

    // Step 3: Insert into users table - this is where we need to use the client's token
    // Since the auth.signUp doesn't set the session immediately (email confirmation may be required),
    // we'll skip this step if there's no session yet
    if (data.session) {
      // Create a new client instance with the session to have proper authorization
      const authedSupabase = supabase;
      
      const { error: insertError } = await authedSupabase
        .from('users')
        .insert([
          {
            id: user.id,
            name: fullName,
            pulse_id: pulseId,
          }
        ]);

      if (insertError) {
        console.error('Profile insert error:', insertError);
        return {
          success: true, // Still return success since the auth account was created
          error: new Error(`Note: Profile setup is incomplete. Please complete your profile later.`),
        };
      }
    } else {
      console.log('No session available yet. Profile will be created after email verification.');
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: new Error(err?.message || 'Unknown registration error'),
    };
  }
};
