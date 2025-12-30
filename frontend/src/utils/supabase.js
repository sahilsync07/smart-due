import { createClient } from "@supabase/supabase-js";

const configs = {
  "Shree Footwear": {
    url: "https://zyupasrvqqomsowleqyk.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dXBhc3J2cXFvbXNvd2xlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTE3ODMsImV4cCI6MjA4MjYyNzc4M30.RuTivvXa17lssxYM0z1C4dHIq2NcNUCsxPEe9pyw3qU"
  },
  // Using string matching for the key provided by user
  "Sri Brundabana": {
    url: "https://ebmkmuonozapdzabtgjv.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWttdW9ub3phcGR6YWJ0Z2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzM5NDksImV4cCI6MjA3MjA0OTk0OX0.Mng3s3ngE72GKYCFBLgs2JthbTRzgtjOOUrtLdTfevU"
  },
  "Sri Brundabana Enterprises": {
    url: "https://ebmkmuonozapdzabtgjv.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWttdW9ub3phcGR6YWJ0Z2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzM5NDksImV4cCI6MjA3MjA0OTk0OX0.Mng3s3ngE72GKYCFBLgs2JthbTRzgtjOOUrtLdTfevU"
  }
};

const clients = {};

export const getSupabase = (companyName) => {
  // Default to Shree Footwear if not found or empty
  const name = configs[companyName] ? companyName : "Shree Footwear";

  if (!clients[name]) {
    clients[name] = createClient(configs[name].url, configs[name].key);
  }
  return clients[name];
};

// Deprecated: default export provided for safe refactoring
export const supabase = getSupabase("Shree Footwear");
