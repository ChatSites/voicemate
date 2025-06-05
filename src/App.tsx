
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages
import ReservePulseID from '@/pages/ReservePulseID';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Inbox from '@/pages/Inbox';
import SendPulse from '@/pages/SendPulse';
import ViewPulse from '@/pages/ViewPulse';
import AuthCallback from '@/pages/auth/callback';
import AuthConfirmation from '@/pages/AuthConfirmation';
import UpdatePassword from '@/pages/UpdatePassword';

// Create a client for React Query with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            <Router>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reserve" element={<ReservePulseID />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/auth/confirm" element={<AuthConfirmation />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/send-pulse" element={<SendPulse />} />
                  <Route path="/pulse/:id" element={<ViewPulse />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
              <Toaster />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
