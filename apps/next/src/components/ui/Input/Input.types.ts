// Input types and interfaces
import type { Input } from "components/ui/input";

import type { ComponentProps } from "react";

// Component Props
export type InputProps = ComponentProps<typeof Input> & {
  label?: string;
  errorMessage?: string;
};
