// AuthButton types and interfaces

import type { Provider } from "@supabase/supabase-js";

import type { ButtonProps } from "ui/Button/Button.types";

import type { ReactNode } from "react";

export type AuthOAuthProvider = Extract<Provider, "google">;

// Component Props
export interface AuthButtonProps extends ButtonProps {
  signInProvider: AuthOAuthProvider;
  signInIcon?: ReactNode;
}
