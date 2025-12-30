import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zyupasrvqqomsowleqyk.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey =
  "sb_publishable_A_0SkVmCBg2oQwEZO9MyVw_oeLG4Rez"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
