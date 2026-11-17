import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nlhovpkvqvaqbhpfdtub.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_IwwxI4IaYzvYz4EbzSylLw_BjR6R3NS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
