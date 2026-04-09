// AuthButton types and interfaces

import { ButtonProps as AuthButtonPropsNextUI } from "@nextui-org/react";
import type { Provider } from "@supabase/supabase-js";
import React from "react";

export type AuthOAuthProvider = Extract<Provider, "google">;

// Component Props
export interface AuthButtonProps extends AuthButtonPropsNextUI {
  signInProvider: AuthOAuthProvider;
  signInIcon?: React.ReactNode;
  className?: string;
}
