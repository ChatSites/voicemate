
import React, { lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import LazyLoadWrapper from '@/components/LazyLoadWrapper';

// Lazy load all pages for better performance
const ReservePulseID = lazy(() => import('@/pages/ReservePulseID'));
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Inbox = lazy(() => import('@/pages/Inbox'));
const SendPulse = lazy(() => import('@/pages/SendPulse'));
const ViewPulse = lazy(() => import('@/pages/ViewPulse'));
const AuthCallback = lazy(() => import('@/pages/auth/callback'));
const AuthConfirmation = lazy(() => import('@/pages/AuthConfirmation'));
const UpdatePassword = lazy(() => import('@/pages/UpdatePassword'));

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
                  <Route path="/" element={
                    <LazyLoadWrapper>
                      <Index />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/reserve" element={
                    <LazyLoadWrapper>
                      <ReservePulseID />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/auth" element={
                    <LazyLoadWrapper>
                      <Auth />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/auth/callback" element={
                    <LazyLoadWrapper>
                      <AuthCallback />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/auth/confirm" element={
                    <LazyLoadWrapper>
                      <AuthConfirmation />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/dashboard" element={
                    <LazyLoadWrapper>
                      <Dashboard />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/inbox" element={
                    <LazyLoadWrapper>
                      <Inbox />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/send-pulse" element={
                    <LazyLoadWrapper>
                      <SendPulse />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/pulse/:id" element={
                    <LazyLoadWrapper>
                      <ViewPulse />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/update-password" element={
                    <LazyLoadWrapper>
                      <UpdatePassword />
                    </LazyLoadWrapper>
                  } />
                  <Route path="*" element={
                    <LazyLoadWrapper>
                      <NotFound />
                    </LazyLoadWrapper>
                  } />
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
