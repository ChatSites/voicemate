
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResetLink, setIsResetLink] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this looks like a password reset link
    const hasResetParams = location.search.includes("token=") || location.search.includes("access_token=");
    setIsResetLink(hasResetParams);
  }, [location.pathname, location.search]);

  const handleGoToPasswordReset = () => {
    // Extract the token from the URL if possible
    const params = new URLSearchParams(location.search);
    const token = params.get('token') || params.get('access_token');
    
    if (token) {
      navigate(`/update-password?access_token=${token}`);
    } else {
      navigate('/update-password');
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Page not found</p>
        
        {isResetLink && (
          <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700 rounded-md">
            <p className="text-amber-200 mb-4">
              It looks like you clicked on a password reset link that's not working correctly.
            </p>
            <Button 
              onClick={handleGoToPasswordReset}
              className="w-full mb-2 bg-voicemate-purple hover:bg-voicemate-purple/90"
            >
              Try to reset password anyway
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={handleGoToLogin}
            variant="outline" 
            className="w-full border-gray-700"
          >
            Go to login page
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full text-gray-400"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
