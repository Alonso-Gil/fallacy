"use client";

import { useRouter } from "i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { createClient } from "utils/supabase/component";

const LogOutButton = () => {
  const router = useRouter();
  const t = useTranslations("Auth");

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      className="me-2 mb-2 inline-flex items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50 focus:outline-none dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
      onClick={() => void handleSignOut()}
    >
      {t("logOut")}
    </button>
  );
};

export default LogOutButton;
