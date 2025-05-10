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
    const { data: existingPulseId } = await supabase
      .from('users')
      .select('id')
      .eq('pulse_id', pulseId)
      .single();

    if (existingPulseId) {
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

    // Step 2: Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.status === 409) {
        return {
          success: false,
          error: new Error('User already registered'),
        };
      }
      return { success: false, error };
    }

    const user = data.user;
    if (!user) {
      return { success: false, error: new Error('No user returned') };
    }

    // Step 3: Add user profile to `users` table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        name: fullName,
        pulse_id: pulseId,
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
