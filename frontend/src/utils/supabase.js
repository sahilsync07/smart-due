import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zyupasrvqqomsowleqyk.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dXBhc3J2cXFvbXNvd2xlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTE3ODMsImV4cCI6MjA4MjYyNzc4M30.RuTivvXa17lssxYM0z1C4dHIq2NcNUCsxPEe9pyw3qU"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
