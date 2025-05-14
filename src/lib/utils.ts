
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to ensure we maintain consistent button styling
export function buttonVariantClasses(variant: string = 'default') {
  switch (variant) {
    case 'action':
      return 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white hover:text-white';
    case 'primary':
      return 'bg-voicemate-purple hover:bg-purple-700 text-white hover:text-white';
    case 'danger':
      return 'bg-voicemate-red hover:bg-red-600 text-white hover:text-white';
    default:
      return '';
  }
}
