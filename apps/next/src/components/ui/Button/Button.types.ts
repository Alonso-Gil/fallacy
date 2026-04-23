import { Button } from "ui/shadcnComponents/button";

import type { ComponentProps, ReactNode } from "react";

export type ButtonProps = Omit<ComponentProps<typeof Button>, "className"> & {
  className?: string;
  text?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
};
