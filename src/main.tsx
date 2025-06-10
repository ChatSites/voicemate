
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HelmetProvider from '@/components/providers/HelmetProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from '@/components/ErrorBoundary';

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import AuthConfirmation from "@/pages/AuthConfirmation";
import AuthDebug from "@/pages/AuthDebug";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import HowItWorks from "@/pages/HowItWorks";
import HowItWorksProfile from "@/pages/HowItWorksProfile";
import Inbox from "@/pages/Inbox";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Profile from "@/pages/Profile";
import RegistrationSuccess from "@/pages/RegistrationSuccess";
import ReservePulseID from "@/pages/ReservePulseID";
import SendPulse from "@/pages/SendPulse";
import Terms from "@/pages/Terms";
import UpdatePassword from "@/pages/UpdatePassword";
import UseCases from "@/pages/UseCases";
import ViewPulse from "@/pages/ViewPulse";
import UserManagement from "@/pages/UserManagement";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/auth/confirmation",
    element: <AuthConfirmation />,
  },
  {
    path: "/auth/debug",
    element: <AuthDebug />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/profile/how-it-works",
    element: <HowItWorksProfile />,
  },
  {
    path: "/inbox",
    element: <Inbox />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/registration-success",
    element: <RegistrationSuccess />,
  },
  {
    path: "/reserve",
    element: <ReservePulseID />,
  },
  {
    path: "/send/:pulseId",
    element: <SendPulse />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/use-cases",
    element: <UseCases />,
  },
  {
    path: "/pulse/:id",
    element: <ViewPulse />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster />
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
