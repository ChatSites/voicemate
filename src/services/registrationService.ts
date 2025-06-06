
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';

// This is a simplified check, final verification happens during registration
export const finalEmailCheck = async (email: string): Promise<boolean> => {
  // Just do basic format validation
  return email && email.includes('@');
};

// This is a simplified check, final verification happens during registration
export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  // Just do basic format validation
  return id && id.length >= 3;
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
  console.log('=== REGISTRATION DEBUG START ===');
  console.log('Registration data:', { fullName, email, pulseId, passwordLength: password.length });
  
  try {
    // Clean up existing auth state to avoid conflicts
    cleanupAuthState();
    
    // First check if PulseID is available
    console.log('Checking PulseID availability before registration...');
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id, pulse_id, name')
      .or(`pulse_id.ilike.${pulseId},name.ilike.${pulseId}`)
      .limit(1);

    if (pulseIdError) {
      console.error('Error checking PulseID:', pulseIdError);
    }

    if (existingPulseId && existingPulseId.length > 0) {
      console.log(`PulseID ${pulseId} is already taken:`, existingPulseId);
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
    
    // Prepare user metadata with the claimed PulseID
    const userData = {
      full_name: fullName,
      pulse_id: pulseId,
    };
    
    console.log('Calling Supabase auth.signUp with data:', userData);
    
    // Attempt registration with explicit configuration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        // Don't set emailRedirectTo to avoid email confirmation requirement
      }
    });
    
    if (authError) {
      console.error('Auth registration error:', authError);
      
      if (authError.message.includes("User already registered")) {
        return { 
          success: false, 
          error: new Error("This email was previously used. Please try logging in or use a different email."),
        };
      }
      
      return { 
        success: false, 
        error: new Error(authError.message || "Something went wrong during registration")
      };
    }
    
    console.log('Auth registration response:', authData);
    console.log('User created:', authData.user ? 'YES' : 'NO');
    console.log('Session created:', authData.session ? 'YES' : 'NO');
    
    if (authData.user) {
      console.log('User ID:', authData.user.id);
      console.log('User email:', authData.user.email);
      console.log('User metadata:', authData.user.user_metadata);
      
      // Wait a moment for the trigger to potentially fire
      console.log('Waiting 2 seconds for database trigger...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if profile was created by trigger
      console.log('Checking if profile was created by trigger...');
      const { data: triggerProfile, error: triggerCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (triggerCheckError) {
        console.error('Error checking for trigger-created profile:', triggerCheckError);
      } else if (triggerProfile) {
        console.log('SUCCESS: Profile was created by trigger:', triggerProfile);
      } else {
        console.log('WARNING: No profile found after trigger delay');
        
        // Manually create profile since trigger failed
        console.log('Attempting manual profile creation...');
        const { data: manualProfile, error: manualError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email
          })
          .select()
          .single();
        
        if (manualError) {
          console.error('Manual profile creation failed:', manualError);
          console.error('Manual error details:', {
            message: manualError.message,
            details: manualError.details,
            hint: manualError.hint,
            code: manualError.code
          });
        } else {
          console.log('SUCCESS: Manual profile creation worked:', manualProfile);
        }
      }
      
      // Final verification - check if we have a profile now
      console.log('Final profile verification...');
      const { data: finalProfile, error: finalError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (finalError) {
        console.error('Final profile check error:', finalError);
      } else if (finalProfile) {
        console.log('FINAL SUCCESS: Profile exists:', finalProfile);
      } else {
        console.error('FINAL FAILURE: No profile found after all attempts');
      }
    }
    
    const emailConfirmNeeded = !authData.session;
    console.log('Email confirmation needed:', emailConfirmNeeded);
    console.log('=== REGISTRATION DEBUG END ===');
    
    return { 
      success: true, 
      user: authData.user,
      session: authData.session,
      emailConfirmNeeded
    };
  } catch (error: any) {
    console.error('=== REGISTRATION ERROR ===', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(error?.message || 'Unknown registration error')
    };
  }
};
