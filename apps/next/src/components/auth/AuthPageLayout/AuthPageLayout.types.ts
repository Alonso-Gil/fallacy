import type { ReactNode } from "react";

export type AuthPageVariant = "login" | "sign-up";

export interface AuthPageLayoutProps {
  className?: string;
  variant: AuthPageVariant;
  children: ReactNode;
}
