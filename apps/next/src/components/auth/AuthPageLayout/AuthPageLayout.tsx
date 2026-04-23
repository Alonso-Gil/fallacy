"use client";
import { Link } from "i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Separator } from "ui/shadcnComponents/separator";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { cn } from "lib/utils";
import AuthBackgroundImage from "../AuthBackgroundImage/AuthBackgroundImage";
import { pickRandomAuthBackground } from "../authBackgrounds";
import AuthPhotoCredit from "../AuthPhotoCredit/AuthPhotoCredit";
import type { AuthPageLayoutProps } from "./AuthPageLayout.types";

const AuthPageLayout: React.FC<AuthPageLayoutProps> = props => {
  const { className, variant, children } = props;
  const tAuth = useTranslations("Auth");
  const [background] = useState(() => pickRandomAuthBackground());
  const isLogin = variant === "login";

  const formColumn = (
    <div className="bg-surface flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6 xl:grow-0 xl:basis-2/5">
      {children}
    </div>
  );

  const visualColumn = (
    <div className="auth-side-glow relative hidden flex-1 items-center justify-center overflow-hidden md:w-1/2 xl:flex xl:grow-0 xl:basis-3/5">
      <AuthBackgroundImage src={background.src} />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-black/70 via-black/55 to-black/40" />
      <RandomFallacy
        className="animate-fade-in relative z-10"
        {...(isLogin ? {} : { controlsAlign: "left" as const })}
      />
      <AuthPhotoCredit
        background={background}
        className={isLogin ? "bottom-3 left-4" : "right-4 bottom-3"}
      />
    </div>
  );

  const columnSeparator = (
    <Separator
      orientation="vertical"
      className="hidden self-stretch xl:block"
    />
  );

  return (
    <div
      className={cn(
        className,
        isLogin ? "Login" : "SignUp",
        "bg-background relative flex flex-1"
      )}
    >
      <Link
        href="/"
        className={cn(
          "text-text-secondary hover:text-foreground hover:bg-muted absolute top-4 z-50 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors xl:text-white/80 xl:hover:bg-white/10 xl:hover:text-white",
          isLogin ? "left-4" : "right-4"
        )}
      >
        <ArrowLeft className="size-4" />
        {tAuth("backToLobby")}
      </Link>
      {isLogin ? (
        <>
          {visualColumn}
          {columnSeparator}
          {formColumn}
        </>
      ) : (
        <>
          {formColumn}
          {columnSeparator}
          {visualColumn}
        </>
      )}
    </div>
  );
};

export default AuthPageLayout;
