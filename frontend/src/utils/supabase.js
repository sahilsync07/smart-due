import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ebmkmuonozapdzabtgjv.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWttdW9ub3phcGR6YWJ0Z2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzM5NDksImV4cCI6MjA3MjA0OTk0OX0.Mng3s3ngE72GKYCFBLgs2JthbTRzgtjOOUrtLdTfevU"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
