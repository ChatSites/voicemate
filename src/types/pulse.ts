
import { Json } from "@/integrations/supabase/types";

// Define the CTA interface for proper typing
export interface CTA {
  label: string;
  action: string;
  url?: string;
  emoji?: string;
}

// Define the Pulse interface to match our database structure
export interface Pulse {
  id: string;
  audio_url: string | null;
  transcript: string | null;
  intent: string | null;
  ctas: CTA[];
  pulse_id: string | null;
  created_at: string;
  status: string;
}
