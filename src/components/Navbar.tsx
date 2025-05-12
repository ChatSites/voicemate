import * as React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleNavigateToAuth = React.useCallback(() => {
    window.location.href = '/auth';
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-md border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">VoiceMate</span>
          {profile?.pulse_id && (
            <span className="text-sm text-voicemate-purple">@{profile.pulse_id}</span>
          )}
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-sm text-gray-200 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#use-cases" className="text-sm text-gray-200 hover:text-white transition-colors">
            Use Cases
          </a>

          {user ? (
            <>
              <a href="/dashboard" className="text-sm text-gray-200 hover:text-white transition-colors">Dashboard</a>
              <a href="/create" className="text-sm text-gray-200 hover:text-white transition-colors">Send Pulse</a>
              <a href="/inbox" className="text-sm text-gray-200 hover:text-white transition-colors">Inbox</a>
              {profile?.name && (
                <span className="text-sm text-gray-400 italic">
                  {profile.name}
                </span>
              )}
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={signOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <a href="/reserve" className="text-sm text-gray-200 hover:text-white transition-colors">
                Reserve PulseID
              </a>
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={handleNavigateToAuth}
              >
                Login / Claim ID
              </Button>
            </>
          )}
        </nav>

        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden border-gray-700"
          onClick={() => console.log("Mobile menu clicked")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
