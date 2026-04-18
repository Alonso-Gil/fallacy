"use client";
import { useRouter } from "i18n/navigation";
import React, { useEffect, useRef } from "react";

import { createClient } from "utils/supabase/component";
import { useAuthStore } from "store/auth/auth.store";
import { AuthProviderProps as Props } from "./AuthProvider.types";

const AuthProvider: React.FC<Props> = ({ initialUser, children }) => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const hydratedRef = useRef(false);

  if (!hydratedRef.current) {
    hydratedRef.current = true;
    useAuthStore.setState({ user: initialUser });
  }

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser]);

  return <>{children}</>;
};

export default AuthProvider;
