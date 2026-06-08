import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Loud, friendly warning instead of a cryptic runtime crash if the keys are
// missing. Copy .env.example to .env and fill these in.
export const hasSupabase = Boolean(url && anon);
if (!hasSupabase) {
  console.error(
    "[Fragrance of Arabia] Missing Supabase config. Copy .env.example to .env " +
      "and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server."
  );
}

export const supabase = createClient(url || "https://placeholder.supabase.co", anon || "placeholder");

// Storage bucket that holds product photos (must be created as public).
export const IMAGE_BUCKET = "product-images";
