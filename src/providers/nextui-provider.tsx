"use client";
import { NextUIProvider as NextUI } from "@nextui-org/react";
import { NextUIProviderProps } from "@nextui-org/react";

const NextUIProvider = ({ children, ...props }: NextUIProviderProps) => {
  return <NextUI {...props}>{children}</NextUI>;
};

export default NextUIProvider;
