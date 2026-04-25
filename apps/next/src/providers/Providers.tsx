"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { useState } from "react";
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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        <OAuthLoginToast />
        <SonnerToaster />
      </QueryClientProvider>
    </AppThemeProvider>
  );
};

export default Providers;
