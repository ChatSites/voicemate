
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
          
          <Card className="w-full max-w-md border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-red-900/20 w-16 h-16 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl text-red-400">Something went wrong</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-center">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-900/50 p-3 rounded border border-gray-700">
                  <summary className="text-sm text-gray-400 cursor-pointer">Error Details</summary>
                  <pre className="text-xs text-red-400 mt-2 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 bg-voicemate-purple hover:bg-purple-700"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
