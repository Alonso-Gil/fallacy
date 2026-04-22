import type { User } from "@supabase/supabase-js";

export interface HomeProps {
  initialUser: User | null;
}
