"use client";
import React from "react";

import useListeners from "hooks/useListeners";
import { AppThemeProvider } from "providers/AppThemeProvider";
import AuthProvider from "providers/AuthProvider/AuthProvider";
import { ProvidersProps as Props } from "./Providers.types";

const Providers: React.FC<Props> = props => {
  const { initialUser, children } = props;
  useListeners();

  return (
    <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </AppThemeProvider>
  );
};

export default Providers;
