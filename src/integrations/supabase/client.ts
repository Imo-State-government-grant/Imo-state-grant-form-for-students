// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rhwwqhzfitsuqvwsltkb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3dxaHpmaXRzdXF2d3NsdGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTAzMTIsImV4cCI6MjA2MTg2NjMxMn0.xqm-mKmNn5lWRT1xVzL-vBdzjesHsWXk3EqQO23sa7o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);