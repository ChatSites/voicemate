
import { toast } from '@/hooks/use-toast';

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
  });
};

export const showErrorToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

export const showWarningToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive", // Using destructive for warnings as well
  });
};
