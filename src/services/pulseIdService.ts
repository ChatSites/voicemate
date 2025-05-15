
import { isPulseIdTaken } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

/**
 * A unified service for handling PulseID availability checks
 * Used by both the reservation page and registration form
 */

// Maintain a cache of already checked pulse IDs to reduce API calls
const pulseIdCache: Record<string, {available: boolean, timestamp: number}> = {};
const CACHE_DURATION = 10000; // 10 seconds cache (reduced for testing)

/**
 * Checks if a PulseID is available
 * @param pulseId The PulseID to check
 * @returns A promise that resolves to a result object
 */
export const checkPulseIdAvailability = async (pulseId: string): Promise<{
  available: boolean,
  suggestions: string[],
  errorMessage?: string
}> => {
  try {
    // Basic validation
    if (!pulseId || pulseId.length < 3) {
      return {
        available: false,
        suggestions: [],
        errorMessage: "PulseID must be at least 3 characters"
      };
    }

    // Normalize the pulseID to lowercase for consistent checking
    const normalizedPulseId = pulseId.toLowerCase();
    
    console.log(`Checking availability for: ${normalizedPulseId}`);

    // Check cache first to avoid unnecessary API calls
    const cached = pulseIdCache[normalizedPulseId];
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`Using service cache for ${normalizedPulseId}: ${cached.available ? 'available' : 'taken'}`);
      return {
        available: cached.available,
        suggestions: cached.available ? [] : generateSuggestions(normalizedPulseId)
      };
    }

    // Check with Supabase - this will check its own cache first
    console.log(`Calling Supabase to check ${normalizedPulseId}`);
    const isTaken = await isPulseIdTaken(normalizedPulseId);
    console.log(`Supabase result for ${normalizedPulseId}: ${isTaken ? 'taken' : 'available'}`);
    
    // Update cache
    pulseIdCache[normalizedPulseId] = {
      available: !isTaken,
      timestamp: Date.now()
    };

    // Return result
    return {
      available: !isTaken,
      suggestions: isTaken ? generateSuggestions(normalizedPulseId) : []
    };
  } catch (error) {
    console.error('Error checking PulseID availability:', error);
    
    // On error, assume ID is available to not block registration
    // but warn the user
    toast({
      title: "Warning",
      description: "Could not verify PulseID availability. Please try again later.",
      variant: "default" // Changed from "warning" to "default" to match the allowed variants
    });
    
    return {
      available: true,
      suggestions: []
    };
  }
};

/**
 * Generate alternative PulseID suggestions
 */
const generateSuggestions = (pulseId: string): string[] => {
  return [
    `${pulseId}${Math.floor(Math.random() * 1000)}`,
    `${pulseId}_${Math.floor(Math.random() * 100)}`,
    `${pulseId}.${Date.now().toString().slice(-4)}`
  ];
};
