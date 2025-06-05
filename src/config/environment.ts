
// Environment configuration management
export const env = {
  // App configuration
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Supabase configuration
  SUPABASE_URL: 'https://vzbadytmoatrwrvgemne.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmFkeXRtb2F0cndydmdlbW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjg5MzIsImV4cCI6MjA2MjMwNDkzMn0.KdyaGRXGKULvjiclJsDFdtDdpb_i8F7wTsPweJPnFa0',
  
  // App URLs
  APP_URL: 'https://voicemate.id',
  
  // Production flags
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  
  // Build configuration
  BUILD_VERSION: import.meta.env.VITE_BUILD_VERSION || '1.0.0',
  BUILD_TIMESTAMP: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString(),
};

// Validation helper
export const validateEnvironment = () => {
  const requiredVars = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('Environment validation passed');
  return true;
};

// Debug helper for development
export const logEnvironment = () => {
  if (env.IS_DEVELOPMENT) {
    console.log('Environment Configuration:', {
      NODE_ENV: env.NODE_ENV,
      IS_PRODUCTION: env.IS_PRODUCTION,
      BUILD_VERSION: env.BUILD_VERSION,
      BUILD_TIMESTAMP: env.BUILD_TIMESTAMP,
      APP_URL: env.APP_URL,
    });
  }
};
