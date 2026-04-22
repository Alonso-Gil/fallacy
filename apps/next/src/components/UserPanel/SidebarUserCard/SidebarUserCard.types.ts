import type { User } from "@supabase/supabase-js";

export interface SidebarUserCardProps {
  className?: string;
  user: User;
}
