
import { isPulseIdTaken, clearAllPulseIdCaches } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

/**
 * A unified service for handling PulseID availability checks
 * Used by both the reservation page and registration form
 */

// Maintain a cache of already checked pulse IDs to reduce API calls
const pulseIdCache: Record<string, {available: boolean, timestamp: number}> = {};
const CACHE_DURATION = 500; // 500ms cache - very short to ensure accuracy

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
  available: boolean | null,
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
    const normalizedPulseId = pulseId.toLowerCase().trim();
    
    console.log(`Service: Checking availability for: ${normalizedPulseId}`);

    // Check cache first, unless skipCache is true
    const cached = pulseIdCache[normalizedPulseId];
    if (!skipCache && cached && (Date.now() - cached.timestamp) < CACHE_DURATION && !forceRefresh) {
      console.log(`Service: Using cache for ${normalizedPulseId}: ${cached.available ? 'available' : 'taken'}`);
      
      return {
        available: cached.available,
        suggestions: cached.available ? [] : generateSuggestions(normalizedPulseId)
      };
    }
    
    // Reset force refresh flag and clear caches
    if (forceRefresh) {
      forceRefresh = false;
      clearAllPulseIdCaches();
      console.log('Service: Force refresh activated, all caches cleared');
    }

    // Check with Supabase
    console.log(`Service: Calling Supabase to check ${normalizedPulseId}`);
    
    const isTaken = await isPulseIdTaken(normalizedPulseId);
    console.log(`Service: Supabase result for ${normalizedPulseId}: ${isTaken ? 'taken' : 'available'}`);
    
    // Update cache with the result
    const currentTime = Date.now();
    pulseIdCache[normalizedPulseId] = {
      available: !isTaken,
      timestamp: currentTime
    };

    return {
      available: !isTaken,
      suggestions: isTaken ? generateSuggestions(normalizedPulseId) : []
    };
  } catch (error) {
    console.error('Service: Error checking PulseID availability:', error);
    
    return {
      available: null,
      suggestions: [],
      errorMessage: "Availability check failed"
    };
  }
};

/**
 * Generate alternative PulseID suggestions
 */
const generateSuggestions = (pulseId: string): string[] => {
  console.log(`Service: Generating suggestions for: ${pulseId}`);
  const timestamp = Date.now().toString().slice(-4);
  return [
    `${pulseId}${Math.floor(Math.random() * 1000)}`,
    `${pulseId}_${Math.floor(Math.random() * 100)}`,
    `${pulseId}${timestamp}`
  ];
};

// Clear the entire cache when needed
export const clearPulseIdCache = () => {
  console.log('Service: Clearing PulseID cache');
  for (const key in pulseIdCache) {
    delete pulseIdCache[key];
  }
  clearAllPulseIdCaches();
};

// Force the next check to bypass all caches
export const forceRefreshNextCheck = () => {
  console.log('Service: Forcing refresh for next check');
  forceRefresh = true;
  localStorage.setItem('force_refresh_pulseId', 'true');
  
  // Clear all cached results
  clearPulseIdCache();
};
