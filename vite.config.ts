
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  
  if (mode === 'development') {
    try {
      // Use dynamic import for ESM module
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (error) {
      console.warn('lovable-tagger not available:', error);
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['@radix-ui/react-toast', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            'vendor-utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-query': ['@tanstack/react-query'],
            'vendor-router': ['react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'auth-components': [
              './src/components/auth/LoginForm',
              './src/components/auth/RegisterForm',
              './src/components/auth/PasswordResetForm'
            ],
            'dashboard-components': [
              './src/components/dashboard/DashboardCards',
              './src/components/dashboard/DashboardHeader'
            ],
            'pulse-components': [
              './src/components/pulse/PulseForm',
              './src/components/pulse/AudioPlayer',
              './src/components/pulse/RecordingArea'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === 'production' ? 'hidden' : true,
    },
    define: {
      __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
      __GIT_COMMIT__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'),
      __BUILD_NUMBER__: JSON.stringify(process.env.VERCEL_BUILD_ID || 'local'),
    },
    preview: {
      host: "::",
      port: 4173,
    },
  };
});
