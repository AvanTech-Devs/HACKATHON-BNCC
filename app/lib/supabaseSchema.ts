// lib/supabaseSchema.ts
import { supabase } from "./supabaseClient";

export const db = supabase.schema("hackton");
