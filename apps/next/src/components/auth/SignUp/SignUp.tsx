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
import { pickRandomAuthBackground } from "../authBackgrounds";
import AuthPhotoCredit from "../AuthPhotoCredit/AuthPhotoCredit";
import EmailAuthForm from "./EmailAuthForm/EmailAuthForm";
import { SignUpProps as Props } from "./SignUp.types";

const SignUp: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Auth.signUp");
  const tAuth = useTranslations("Auth");
  const background = pickRandomAuthBackground();

  return (
    <div className={cn(className, "SignUp bg-background relative flex flex-1")}>
      <Link
        href="/"
        className="text-text-secondary hover:text-foreground hover:bg-muted absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors xl:text-white/80 xl:hover:bg-white/10 xl:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        {tAuth("backToLobby")}
      </Link>
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
      <div className="auth-side-glow relative hidden flex-1 items-center justify-center overflow-hidden md:w-1/2 xl:flex xl:grow-0 xl:basis-3/5">
        <Image
          src={background.src}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 60vw, 50vw"
          className="scale-105 object-cover object-center opacity-25 blur-[2px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-black/70 via-black/55 to-black/40" />
        <RandomFallacy
          className="animate-fade-in relative z-10"
          controlsAlign="left"
        />
        <AuthPhotoCredit background={background} className="right-4 bottom-3" />
      </div>
    </div>
  );
};

export default SignUp;
