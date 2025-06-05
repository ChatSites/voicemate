// Error reporting and logging utilities
import { env } from '@/config/environment';

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  buildVersion: string;
  environment: string;
}

class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), 'unhandledrejection');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), 'javascript');
    });
  }

  reportError(error: Error, context: string = 'unknown', userId?: string): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId,
      buildVersion: env.BUILD_VERSION,
      environment: env.NODE_ENV,
    };

    // Log to console in development
    if (env.IS_DEVELOPMENT) {
      console.error(`🚨 Error [${context}]:`, errorReport);
    }

    // Add to queue
    this.addToQueue(errorReport);

    // In production, you could send to error reporting service
    if (env.IS_PRODUCTION) {
      this.sendToReportingService(errorReport);
    }
  }

  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  private async sendToReportingService(errorReport: ErrorReport): Promise<void> {
    try {
      // Store in localStorage as fallback for now
      // In a real app, you'd send to Sentry, LogRocket, etc.
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 10 errors in localStorage
      const recentErrors = existingErrors.slice(-10);
      localStorage.setItem('error_reports', JSON.stringify(recentErrors));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }
  }

  getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }

  clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

export const errorReporter = ErrorReporter.getInstance();

// React Error Boundary helper
export const logReactError = (error: Error, errorInfo: any) => {
  errorReporter.reportError(error, 'react-boundary');
  
  if (env.IS_DEVELOPMENT) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }
};
