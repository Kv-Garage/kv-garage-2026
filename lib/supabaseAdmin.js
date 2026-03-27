import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pwkafubmtyeufycnkmpz.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a2FmdWJtdHlldWZ5Y25rbXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTA5NzQsImV4cCI6MjA4NjU4Njk3NH0.YqmBtvSchzy6wcN1OJ0G_lM6c51BxezBbg8n5TBPZfA";

console.log("SUPABASE ADMIN URL:", supabaseUrl);
console.log("SUPABASE ADMIN KEY EXISTS:", !!supabaseKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
