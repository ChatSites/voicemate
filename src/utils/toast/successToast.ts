
import { toast } from '@/hooks/use-toast';

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
  });
};
