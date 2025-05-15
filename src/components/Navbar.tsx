
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fixed logo URLs for both themes
  const darkModeLogo = "https://i.ibb.co/k2KwyQh/voicemate-logo-horiz-dark.png";
  const lightModeLogo = "https://i.ibb.co/bM62K2G/voicemate-logo-horiz-light.png"; // Corrected URL

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? isDark 
              ? "bg-black/80 backdrop-blur-md border-b border-border/50" 
              : "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src={isDark ? darkModeLogo : lightModeLogo}
              alt="VoiceMate" 
              className="h-8" 
            />
            {profile?.pulse_id && (
              <span className={`text-sm ${isDark ? 'text-voicemate-purple' : 'text-voicemate-purple'}`}>@{profile.pulse_id}</span>
            )}
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              How It Works
            </a>
            <a href="#use-cases" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              Use Cases
            </a>

            {user ? (
              <>
                <a href="/dashboard" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>Dashboard</a>
                <a href="/create" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>Send Pulse</a>
                <a href="/inbox" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>Inbox</a>
                {profile?.name && (
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>{profile.name}</span>
                )}
                <ThemeToggle />
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
                <a href="/reserve" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  Reserve PulseID
                </a>
                <ThemeToggle />
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

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              className={isDark ? "border-gray-700" : "border-gray-300"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-t px-4 py-6 space-y-4 transition-all duration-300 ease-in-out`}>
          {user ? (
            <>
              <div className={isDark ? "text-white text-sm" : "text-gray-900 text-sm"}>
                <span className="block font-semibold">@{profile?.pulse_id || 'loading'}</span>
                <span className="block text-muted-foreground">{profile?.name}</span>
              </div>
              <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                Dashboard
              </a>
              <a href="/create" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                Send Pulse
              </a>
              <a href="/inbox" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                Inbox
              </a>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <a href="/reserve" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                Reserve PulseID
              </a>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={handleNavigateToAuth}
              >
                Login / Claim ID
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
