
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

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
    // Step 1: Check PulseID availability directly from database 
    // to be absolutely sure before proceeding
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', pulseId)
      .single();

    if (pulseIdError && pulseIdError.code !== 'PGRST116') { // Not found is OK
      console.log('Error checking PulseID:', pulseIdError);
      // Continue with registration anyway, as this is not critical
    } else if (existingPulseId) {
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

    console.log('Proceeding with registration for:', email, 'with PulseID:', pulseId);

    // Step 2: Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId,
        },
        emailRedirectTo: `${window.location.origin}/auth-confirmation?type=signup`,
      }
    });

    if (error) {
      console.error('Registration error from Supabase:', error);
      
      if (error.message.includes('User already registered')) {
        return {
          success: false,
          error: new Error('User already registered. Please login instead.'),
        };
      }
      
      return { 
        success: false, 
        error: new Error(`Registration failed: ${error.message}`) 
      };
    }

    const user = data.user;
    if (!user) {
      return { success: false, error: new Error('No user returned') };
    }

    // Step 3: Add user profile to `profiles` table
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        username: pulseId,
      },
    ]);

    if (insertError) {
      console.error('Profile insert error:', insertError);
      return {
        success: false,
        error: new Error(`Profile insert failed: ${insertError.message}`),
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected registration error:', err);
    return {
      success: false,
      error: new Error(err?.message || 'Unknown registration error'),
    };
  }
};
