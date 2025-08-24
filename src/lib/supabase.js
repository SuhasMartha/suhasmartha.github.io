import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://maagvnyxarmbzozufqcd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hYWd2bnl4YXJtYnpvenVmcWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTc4MzAsImV4cCI6MjA3MTA5MzgzMH0.DaUp1QSIWGfS29d_40NycU_vMpJvWK9reO4QnkLtBns";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
