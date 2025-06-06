
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
    console.log(`RegisterUser: Attempting to register with PulseID: ${pulseId}`);
    
    // Step 1: Check PulseID availability using both possible columns
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id, pulse_id, name')
      .or(`pulse_id.ilike.${pulseId},name.ilike.${pulseId}`)
      .limit(1);

    console.log(`RegisterUser: PulseID check result:`, { existingPulseId, pulseIdError });

    if (pulseIdError) {
      console.error('RegisterUser: Error checking PulseID:', pulseIdError);
    }

    if (existingPulseId && existingPulseId.length > 0) {
      console.log(`RegisterUser: PulseID ${pulseId} is already taken:`, existingPulseId);
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

    console.log(`RegisterUser: PulseID ${pulseId} appears to be available`);

    // Step 2: Sign up user via Supabase Auth with proper email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId,
        },
        // Enable email confirmation and set redirect URL
        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
      },
    });

    if (error) {
      console.error('RegisterUser: Supabase auth error:', error);
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
    const session = data.session;
    
    if (!user) {
      return { success: false, error: new Error('No user returned') };
    }

    console.log('RegisterUser: User registered successfully:', {
      userId: user.id,
      email: user.email,
      hasSession: !!session,
      emailConfirmed: user.email_confirmed_at ? 'yes' : 'no'
    });

    // The database trigger should automatically create the user profile
    // Let's verify it was created
    if (session) {
      console.log('RegisterUser: User is immediately logged in with session');
      
      // Double-check that the user profile was created by the trigger
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError || !userProfile) {
        console.error('RegisterUser: User profile not created by trigger:', profileError);
        
        // Manual fallback - create the profile if trigger failed
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email
          });
        
        if (insertError) {
          console.error('RegisterUser: Failed to create user profile manually:', insertError);
        } else {
          console.log('RegisterUser: User profile created manually as fallback');
        }
      } else {
        console.log('RegisterUser: User profile created successfully by trigger:', userProfile);
      }
    } else {
      console.log('RegisterUser: Email confirmation required - user will need to verify email');
    }

    return { success: true };
  } catch (err: any) {
    console.error('RegisterUser: Unexpected error:', err);
    return {
      success: false,
      error: new Error(err?.message || 'Unknown registration error'),
    };
  }
};
