
import { supabase } from '@/integrations/supabase/client';

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
) => {
  console.log('Starting registration for:', { email, pulseId, fullName });

  try {
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

    // Register with Supabase Auth
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
      console.error('Registration error:', error);
      return {
        success: false,
        error: new Error(error.message)
      };
    }

    console.log('Registration successful:', data.user?.id);

    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmNeeded: !data.session
    };

  } catch (error: any) {
    console.error('Registration failed:', error);
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
