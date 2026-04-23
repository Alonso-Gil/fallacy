"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Toaster } from "sonner";

import { AppThemeProvider } from "providers/AppThemeProvider";
import AuthProvider from "providers/AuthProvider/AuthProvider";
import OAuthLoginToast from "providers/OAuthLoginToast/OAuthLoginToast";
import { ProvidersProps as Props } from "./Providers.types";

const SonnerToaster = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      closeButton
      position="top-center"
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
};

const Providers: React.FC<Props> = props => {
  const { initialUser, children } = props;

  return (
    <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      <OAuthLoginToast />
      <SonnerToaster />
    </AppThemeProvider>
  );
};

export default Providers;
