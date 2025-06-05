
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  fullScreen?: boolean;
  showRetry?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
  fullScreen = false,
  showRetry = true
}) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        
        <Card className="w-full max-w-md border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-red-900/20 w-16 h-16 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-400">{title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-center">{message}</p>
            
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full bg-voicemate-purple hover:bg-purple-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center", className)}>
      <div className="mb-4 p-3 rounded-full bg-red-900/20 w-16 h-16 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
