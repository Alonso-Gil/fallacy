// Button types and interfaces

import { ButtonProps as ButtonPropsNextUI } from "@nextui-org/react";

// Component Props
export interface ButtonProps extends ButtonPropsNextUI {
  children?: React.ReactNode;
  text?: string;
  icon?: React.ReactNode;
}
