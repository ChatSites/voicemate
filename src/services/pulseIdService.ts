
import { isPulseIdTaken, clearAllPulseIdCaches } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

/**
 * A unified service for handling PulseID availability checks
 * Used by both the reservation page and registration form
 */

// Maintain a cache of already checked pulse IDs to reduce API calls
const pulseIdCache: Record<string, {available: boolean, timestamp: number}> = {};
const CACHE_DURATION = 5000; // 5 seconds cache (reduced for faster checks)

// Flag for forcing a fresh check
let forceRefresh = false;

/**
 * Checks if a PulseID is available
 * @param pulseId The PulseID to check
 * @param skipCache Whether to skip the cache and force a fresh check
 * @returns A promise that resolves to a result object
 */
export const checkPulseIdAvailability = async (
  pulseId: string, 
  skipCache: boolean = false
): Promise<{
  available: boolean,
  suggestions: string[],
  errorMessage?: string
}> => {
  try {
    // Basic validation
    if (!pulseId || pulseId.length < 3) {
      console.log(`Service: PulseID too short: ${pulseId}`);
      return {
        available: false,
        suggestions: [],
        errorMessage: "PulseID must be at least 3 characters"
      };
    }

    // Normalize the pulseID to lowercase for consistent checking
    const normalizedPulseId = pulseId.toLowerCase();
    
    console.log(`Service: Checking availability for: ${normalizedPulseId}`);

    // Check cache first to avoid unnecessary API calls, unless skipCache is true
    const cached = pulseIdCache[normalizedPulseId];
    if (!skipCache && cached && (Date.now() - cached.timestamp) < CACHE_DURATION && !forceRefresh) {
      console.log(`Service: Using cache for ${normalizedPulseId}: ${cached.available ? 'available' : 'taken'}`);
      return {
        available: cached.available,
        suggestions: cached.available ? [] : generateSuggestions(normalizedPulseId)
      };
    }
    
    // Reset force refresh flag
    if (forceRefresh) {
      forceRefresh = false;
      clearAllPulseIdCaches(); // Clear all Supabase caches too
    }

    // Check with Supabase - this will check its own cache first
    console.log(`Service: Calling Supabase to check ${normalizedPulseId}`);
    const isTaken = await isPulseIdTaken(normalizedPulseId);
    console.log(`Service: Supabase result for ${normalizedPulseId}: ${isTaken ? 'taken' : 'available'}`);
    
    // Update cache with consistent timestamp
    const currentTime = Date.now();
    pulseIdCache[normalizedPulseId] = {
      available: !isTaken,
      timestamp: currentTime
    };

    // Return result
    return {
      available: !isTaken,
      suggestions: isTaken ? generateSuggestions(normalizedPulseId) : []
    };
  } catch (error) {
    console.error('Service: Error checking PulseID availability:', error);
    
    // On error, assume ID is available to not block registration
    // but warn the user
    toast({
      title: "Warning",
      description: "Could not verify PulseID availability. Please try again later.",
      variant: "default" // Using "default" to match the allowed variants
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
  console.log(`Service: Generating suggestions for: ${pulseId}`);
  return [
    `${pulseId}${Math.floor(Math.random() * 1000)}`,
    `${pulseId}_${Math.floor(Math.random() * 100)}`,
    `${pulseId}.${Date.now().toString().slice(-4)}`
  ];
};

// Clear the entire cache when needed (e.g., on logout)
export const clearPulseIdCache = () => {
  console.log('Service: Clearing PulseID cache');
  for (const key in pulseIdCache) {
    delete pulseIdCache[key];
  }
  clearAllPulseIdCaches(); // Also clear Supabase caches
};

// Force the next check to bypass all caches
export const forceRefreshNextCheck = () => {
  console.log('Service: Forcing refresh for next check');
  forceRefresh = true;
};
