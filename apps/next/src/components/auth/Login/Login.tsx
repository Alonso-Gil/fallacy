import { Link } from "i18n/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import AuthButton from "ui/AuthButton/AuthButton";
import Logo from "ui/Logo/Logo";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import EmailAuthForm from "../SignUp/EmailAuthForm/EmailAuthForm";
import { LoginProps as Props } from "./Login.types";

const Login: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Auth.login");
  const tAuth = useTranslations("Auth");

  return (
    <div className={cn(className, "Login bg-background relative flex flex-1")}>
      <Link
        href="/"
        className="text-text-secondary hover:text-foreground hover:bg-muted absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {tAuth("backToLobby")}
      </Link>
      <div className="auth-side-glow relative hidden flex-1 items-center justify-center overflow-hidden md:w-1/2 xl:flex xl:grow-0 xl:basis-3/5">
        <RandomFallacy className="animate-fade-in" />
      </div>
      <Separator
        orientation="vertical"
        className="hidden self-stretch xl:block"
      />
      <div className="bg-surface flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6 xl:grow-0 xl:basis-2/5">
        <Logo className="md:self-start" />
        <div className="animate-fade-in-right-to-left flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
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
          <Separator className="my-8 w-full" variant="fade" />
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
    </div>
  );
};

export default Login;
