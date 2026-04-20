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
import EmailAuthForm from "./EmailAuthForm/EmailAuthForm";
import { SignUpProps as Props } from "./SignUp.types";

const SignUp: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Auth.signUp");
  const tAuth = useTranslations("Auth");

  return (
    <div
      className={cn(className, "SignUpPage bg-background relative flex flex-1")}
    >
      <Link
        href="/"
        className="text-text-secondary hover:text-foreground hover:bg-muted absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {tAuth("backToLobby")}
      </Link>
      <div className="SignUp animate-fade-in-right-to-left bg-background flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6">
        <Logo className="md:self-start" />
        <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
          <h3 className="text-foreground pt-4 pb-6 font-semibold lg:pt-20">
            {t("title")}
          </h3>
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
          <Separator className="my-6 w-full" variant="fade" />
          <EmailAuthForm context="sign-up" className="mb-4 w-full" />
          <Link
            className="text-text-secondary hover:text-accent text-center transition-colors"
            href="/login"
          >
            <p>
              {t("hasAccount")}{" "}
              <span className="text-accent underline">{t("loginLink")}</span>
            </p>
          </Link>
        </div>
        <p className="text-text-secondary text-sm">
          {t("footer", { year: new Date().getFullYear() })}
        </p>
      </div>
      <Separator
        orientation="vertical"
        className="hidden self-stretch xl:block"
      />
      <div className="animate-fade-in hidden flex-1 items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
    </div>
  );
};

export default SignUp;
