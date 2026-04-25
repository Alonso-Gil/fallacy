"use client";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "ui/shadcnComponents/button";
import { useRouter } from "i18n/navigation";

const AuthActionButton = () => {
  const router = useRouter();
  const t = useTranslations("Auth");

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="hover:bg-primary-hover shadow-primary/25 hover:shadow-primary/35 w-full shadow-md transition-shadow"
      onClick={() => router.push("/login")}
    >
      <LogIn data-icon="inline-start" />
      {t("signIn")}
    </Button>
  );
};

export default AuthActionButton;
