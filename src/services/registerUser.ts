
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
    // Step 1: Check PulseID availability using ilike for case insensitivity
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id')
      .ilike('pulse_id', pulseId)
      .maybeSingle();

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

    // Step 2: Sign up user via Supabase Auth - ENSURE email confirmation is required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId, // Make sure pulse_id is included here
        },
        // Always redirect to auth/callback with signup type
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

    // Step 3: Insert into users table is now handled by the Supabase trigger
    // We'll log confirmation for debugging purposes
    console.log('User registered with PulseID:', pulseId);
    console.log('Profile creation will be handled by database trigger');

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: new Error(err?.message || 'Unknown registration error'),
    };
  }
};
