// AuthButton types and interfaces

import { ButtonProps as AuthButtonPropsNextUI } from "@nextui-org/react";
import React from "react";

/** TODO(Supabase): Puedes alinear esto con `Provider` de @supabase/supabase-js cuando reconectes auth. */
export type AuthOAuthProvider = "google";

// Component Props
export interface AuthButtonProps extends AuthButtonPropsNextUI {
  signInProvider: AuthOAuthProvider;
  signInIcon?: React.ReactNode;
  className?: string;
}
