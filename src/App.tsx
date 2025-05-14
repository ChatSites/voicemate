
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import AuthDebug from "./pages/AuthDebug";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import UpdatePassword from "./pages/UpdatePassword";
import ReservePulseID from "./pages/ReservePulseID";
import Dashboard from "./pages/Dashboard";
import SendPulse from "./pages/SendPulse";
import Inbox from "./pages/Inbox";
import AuthConfirmation from "./pages/AuthConfirmation";
import AuthCallback from "./pages/auth/callback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/reserve" element={<ReservePulseID />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<SendPulse />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/auth-confirmation" element={<AuthConfirmation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
