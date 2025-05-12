
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

    // Step 3: Insert into users table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        name: fullName,
        pulse_id: pulseId, // This is the pulse_id field in users table
      },
    ]);

    if (insertError) {
      return {
        success: false,
        error: new Error(`Profile insert failed: ${insertError.message}`),
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: new Error(err?.message || 'Unknown registration error'),
    };
  }
};
