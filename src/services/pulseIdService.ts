
import { isPulseIdTaken, clearAllPulseIdCaches } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

/**
 * A unified service for handling PulseID availability checks
 * Used by both the reservation page and registration form
 */

// Maintain a cache of already checked pulse IDs to reduce API calls
// Using a shorter cache duration for more accurate results
const pulseIdCache: Record<string, {available: boolean, timestamp: number}> = {};
const CACHE_DURATION = 1000; // 1 second cache (reduced for more accurate checks)

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
      
      // Show a toast when using cached results
      try {
        toast({
          title: "Using cached result",
          description: `PulseID '${normalizedPulseId}' is ${cached.available ? 'available' : 'already taken'} (cached)`,
          variant: cached.available ? "default" : "destructive"
        });
      } catch (err) {
        console.error("Toast error:", err);
      }
      
      return {
        available: cached.available,
        suggestions: cached.available ? [] : generateSuggestions(normalizedPulseId)
      };
    }
    
    // Reset force refresh flag
    if (forceRefresh) {
      forceRefresh = false;
      clearAllPulseIdCaches(); // Clear all Supabase caches too
      console.log('Service: Force refresh activated, all caches cleared');
      
      // Show a toast when force refreshing
      try {
        toast({
          title: "Force Refresh",
          description: "Cleared caches for a fresh availability check",
          variant: "default"
        });
      } catch (err) {
        console.error("Toast error:", err);
      }
    }

    // Check with Supabase - this will check its own cache first
    console.log(`Service: Calling Supabase to check ${normalizedPulseId}`);
    
    // Show a toast when checking with Supabase
    try {
      toast({
        title: "Checking availability",
        description: `Verifying if '${normalizedPulseId}' is available...`,
        variant: "default"
      });
    } catch (err) {
      console.error("Toast error:", err);
    }
    
    const isTaken = await isPulseIdTaken(normalizedPulseId);
    console.log(`Service: Supabase result for ${normalizedPulseId}: ${isTaken ? 'taken' : 'available'}`);
    
    // Update cache with consistent timestamp
    const currentTime = Date.now();
    pulseIdCache[normalizedPulseId] = {
      available: !isTaken,
      timestamp: currentTime
    };
    
    // Always show a toast with the result
    try {
      toast({
        title: `PulseID ${!isTaken ? 'Available' : 'Unavailable'}`,
        description: !isTaken 
          ? `'${normalizedPulseId}' is available for you to claim!` 
          : `'${normalizedPulseId}' is already taken. Try another one.`,
        variant: !isTaken ? "default" : "destructive"
      });
    } catch (err) {
      console.error("Toast error:", err);
    }

    // Return result
    return {
      available: !isTaken,
      suggestions: isTaken ? generateSuggestions(normalizedPulseId) : []
    };
  } catch (error) {
    console.error('Service: Error checking PulseID availability:', error);
    
    // On error, don't assume availability - warn the user
    try {
      toast({
        title: "Availability Check Error",
        description: "Could not verify PulseID availability. Please try again or click 'Force refresh'.",
        variant: "destructive"
      });
    } catch (err) {
      console.error("Toast error:", err);
    }
    
    return {
      available: null, // Return null instead of assuming true
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

// Clear the entire cache when needed (e.g., on logout)
export const clearPulseIdCache = () => {
  console.log('Service: Clearing PulseID cache');
  for (const key in pulseIdCache) {
    delete pulseIdCache[key];
  }
  clearAllPulseIdCaches(); // Also clear Supabase caches
  
  try {
    toast({
      title: "Cache Cleared",
      description: "All PulseID availability caches have been cleared.",
    });
  } catch (err) {
    console.error("Toast error:", err);
  }
};

// Force the next check to bypass all caches
export const forceRefreshNextCheck = () => {
  console.log('Service: Forcing refresh for next check');
  forceRefresh = true;
  localStorage.setItem('force_refresh_pulseId', 'true');
  
  // Also clear all cached results
  clearPulseIdCache();
  
  // Show toast to confirm refresh
  try {
    toast({
      title: "Cache Cleared",
      description: "All cached PulseID data has been cleared. Next check will be fresh.",
    });
  } catch (err) {
    console.error("Toast error:", err);
  }
};
