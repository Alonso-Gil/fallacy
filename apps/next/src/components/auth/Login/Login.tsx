import { Link } from "i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import AuthButton from "ui/AuthButton/AuthButton";
import GoogleIcon from "ui/icons/GoogleIcon/GoogleIcon";
import Logo from "ui/Logo/Logo";
import { Separator } from "ui/shadcnComponents/separator";
import AuthPageLayout from "../AuthPageLayout/AuthPageLayout";
import EmailAuthForm from "../EmailAuthForm/EmailAuthForm";
import type { LoginProps } from "./Login.types";

const Login: React.FC<LoginProps> = props => {
  const { className } = props;
  const t = useTranslations("Auth.login");

  return (
    <AuthPageLayout className={className} variant="login">
      <Logo className="md:self-start" />
      <div className="animate-fade-in-right-to-left flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h1 className="text-foreground pt-4 pb-2 font-semibold lg:pt-20">
          {t("title")}
        </h1>
        <p className="text-text-secondary pb-8">{t("subtitle")}</p>
        <AuthButton signInIcon={<GoogleIcon />} signInProvider="google" />
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
    </AuthPageLayout>
  );
};

export default Login;
