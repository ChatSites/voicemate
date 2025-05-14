
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FormFeedbackProps {
  message: string | React.ReactNode;
  type?: FeedbackType;
  className?: string;
}

const FormFeedback = ({ message, type = 'info', className }: FormFeedbackProps) => {
  if (!message) return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 mt-1.5 text-sm",
        type === 'success' && "text-green-500",
        type === 'error' && "text-red-500",
        type === 'warning' && "text-amber-400",
        type === 'info' && "text-blue-400",
        className
      )}
    >
      {type === 'success' && <CheckCircle className="h-4 w-4" />}
      {type === 'error' && <AlertTriangle className="h-4 w-4" />}
      {type === 'warning' && <AlertTriangle className="h-4 w-4" />}
      {type === 'info' && <Info className="h-4 w-4" />}
      <span>{message}</span>
    </div>
  );
};

export default FormFeedback;
