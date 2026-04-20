"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "ui/Button/Button";
import Input from "ui/Input/Input";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/component";
import { createLoginEmailSchema } from "./EmailAuthForm.helpers";
import type {
  EmailAuthFormProps,
  EmailLoginFormSchema,
  EmailSignUpFormSchema
} from "./EmailAuthForm.types";

const EmailAuthForm: React.FC<EmailAuthFormProps> = props => {
  const { context, className } = props;
  const t = useTranslations("Auth.form");
  const tVal = useTranslations("Auth.form.validation");
  const router = useRouter();

  const schema = useMemo(
    () =>
      createLoginEmailSchema({
        required: tVal("required"),
        invalidEmail: tVal("invalidEmail"),
        minLength: (min: number) => tVal("minLength", { min }),
        maxLength: (max: number) => tVal("maxLength", { max })
      }),
    [tVal]
  );

  const formMethods = useForm<EmailSignUpFormSchema | EmailLoginFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema)
  });
  const { register, formState, handleSubmit } = formMethods;
  const { email, password } = formState.errors ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (
    form: EmailSignUpFormSchema | EmailLoginFormSchema
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      setErrorMessage(t("errors.supabaseConfig"));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage(t("errors.noClient"));
      return;
    }

    const { email, password } = form;
    try {
      if (context === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!!data && !error) {
          router.push("/");
          router.refresh();
        } else {
          setErrorMessage(error?.message ?? t("errors.invalidCredentials"));
          setIsLoading(false);
        }
      }

      if (context === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (!!data && !error) {
          router.push("/");
          router.refresh();
        } else {
          setErrorMessage(error?.message ?? t("errors.invalidCredentials"));
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        t("errors.unexpected", {
          message: error instanceof Error ? error.message : String(error)
        })
      );
    }
  };

  return (
    <form
      className={className}
      onSubmit={event => {
        void handleSubmit(submitHandler)(event);
      }}
    >
      <Input
        {...register("email")}
        className="mb-6"
        label={t("email")}
        type="email"
        errorMessage={email?.message}
        placeholder={t("emailPlaceholder")}
      />
      <Input
        {...register("password")}
        className="mb-6"
        label={t("password")}
        type="password"
        errorMessage={password?.message}
        placeholder={t("passwordPlaceholder")}
      />
      <Button
        className="shadow-primary/25 hover:shadow-primary/35 mb-2 shadow-md transition-shadow"
        text={context === "sign-up" ? t("submitSignUp") : t("submitLogin")}
        type="submit"
        isLoading={isLoading}
        isDisabled={!isSupabaseConfigured()}
        title={isSupabaseConfigured() ? undefined : t("supabaseDisabledButton")}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default EmailAuthForm;
