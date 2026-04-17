"use client";
import { Link } from "i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import AuthButton from "ui/AuthButton/AuthButton";
import Logo from "ui/Logo/Logo";
import { cn } from "lib/utils";
import EmailAuthForm from "../SignUp/EmailAuthForm/EmailAuthForm";
import { LoginProps as Props } from "./Login.types";

const Login: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Auth.login");

  return (
    <div
      className={cn(
        className,
        "Login flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6"
      )}
    >
      <Logo className="md:self-start" />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h1 className="text-foreground pt-4 pb-6 font-semibold lg:pt-20">
          {t("title")}
        </h1>
        <p className="text-text-secondary pb-8">{t("subtitle")}</p>
        <AuthButton
          signInIcon={
            <Image
              src="/assets/images/google.svg"
              alt=""
              className="h-6 w-6"
              width={24}
              height={24}
              unoptimized
              suppressHydrationWarning
            />
          }
          signInProvider="google"
        />
        <hr className="border-border my-8 w-full border-t" />
        <EmailAuthForm context="login" className="mb-4 w-full" />
        <Link
          className="text-text-secondary hover:text-accent text-center transition-colors"
          href="/sign-up"
        >
          <p>
            {t("noAccount")}{" "}
            <span className="text-accent underline">{t("signUpLink")}</span>
          </p>
        </Link>
      </div>
      <p className="text-text-secondary text-sm">
        {t("footer", { year: new Date().getFullYear() })}
      </p>
    </div>
  );
};

export default Login;
