
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

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

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <ToastProvider>
          <AuthProvider>
            <Router>
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
              <Toaster />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
