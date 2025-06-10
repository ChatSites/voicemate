
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Menu, X, User, Send, Inbox } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Corrected logo URLs with the new links
  const darkModeLogo = "https://i.ibb.co/k2KwyQhN/voicemate-logo-horiz-dark.png";
  const lightModeLogo = "https://i.ibb.co/bM62K2G9/voicemate-logo-horiz-light.png";
  // Small logo for mobile screens
  const mobileLogoTransparent = "https://i.ibb.co/B2xzy2Kr/vm-logo-transparent.png";

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

  // Simplified navigation items for authenticated users - removed BarChart3 icon from Dashboard
  const authNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/send-pulse', label: 'Send', icon: Send },
    { href: '/inbox', label: 'Inbox', icon: Inbox },
    { href: '/profile', label: 'Profile', icon: User },
  ];

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
            {/* Desktop logo (hidden on small screens) */}
            <img 
              src={isDark ? darkModeLogo : lightModeLogo}
              alt="VoiceMate" 
              className="h-8 hidden sm:block" 
            />
            {/* Mobile logo (visible on small screens) */}
            <img 
              src={mobileLogoTransparent}
              alt="VM" 
              className="h-8 sm:hidden" 
            />
            {profile?.pulse_id && (
              <span className={`text-sm ${isDark ? 'text-voicemate-purple' : 'text-voicemate-purple'}`}>@{profile.pulse_id}</span>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <a href="/how-it-works" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  How It Works
                </a>
                <a href="/use-cases" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  Use Cases
                </a>
                <a href="/reserve" className={`text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  Reserve PulseID
                </a>
              </>
            ) : (
              <>
                {authNavItems.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors ${
                      location.pathname === item.href ? 'text-voicemate-purple' : ''
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </a>
                ))}
                {profile?.name && (
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} italic hidden lg:block`}>
                    {profile.name}
                  </span>
                )}
              </>
            )}

            <ThemeToggle />
            
            {user ? (
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={signOut}
              >
                Logout
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-voicemate-red hover:bg-red-500 transition-colors"
                onClick={handleNavigateToAuth}
              >
                Login / Claim ID
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              className={isDark ? "border-gray-700" : "border-gray-300"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed top-20 left-0 right-0 z-40 ${isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'} border-t backdrop-blur-md`}>
          <div className="container mx-auto px-4 py-6 space-y-4">
            {user ? (
              <>
                <div className={`${isDark ? "text-white" : "text-gray-900"} pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <span className="block font-semibold text-voicemate-purple">@{profile?.pulse_id || 'loading'}</span>
                  <span className="block text-sm text-muted-foreground">{profile?.name}</span>
                </div>
                
                {authNavItems.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors py-2 ${
                      location.pathname === item.href ? 'text-voicemate-purple' : ''
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </a>
                ))}
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full bg-voicemate-red hover:bg-red-500 transition-colors mt-4"
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
                <a href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors py-2`}>
                  How It Works
                </a>
                <a href="/use-cases" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors py-2`}>
                  Use Cases
                </a>
                <a href="/reserve" onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors py-2`}>
                  Reserve PulseID
                </a>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full bg-voicemate-red hover:bg-red-500 transition-colors mt-4"
                  onClick={handleNavigateToAuth}
                >
                  Login / Claim ID
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
