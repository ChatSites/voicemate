
import { toast } from '@/hooks/use-toast';

export const showWarningToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive", // Using destructive for warnings as well
  });
};
