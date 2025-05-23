// AuthButton types and interfaces

import { ButtonProps as AuthButtonPropsNextUI } from "@nextui-org/react";
import { Provider } from "@supabase/supabase-js";
import React from "react";

// Component Props
export interface AuthButtonProps extends AuthButtonPropsNextUI {
  signInProvider: Provider;
  signInIcon?: React.ReactNode;
  className?: string;
}
