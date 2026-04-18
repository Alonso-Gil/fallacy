import { User } from "@supabase/supabase-js";
import { ReactNode } from "react";

export interface AuthProviderProps {
  initialUser: User | null;
  children: ReactNode;
}
