"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import Button from "ui/Button/Button";
import Input from "ui/Input/Input";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/component";
import { useRouter } from "i18n/navigation";
import type {
  EmailAuthFormProps,
  EmailLoginFormSchema,
  EmailSignUpFormSchema
} from "./EmailAuthForm.types";
import {
  type AuthFormErrorKey,
  createLoginEmailSchema,
  createSignUpEmailSchema,
  evaluatePasswordRules,
  signInWithEmailPassword,
  signUpWithEmailPassword
} from "./EmailAuthForm.utils";
import PasswordField from "./PasswordField/PasswordField";
import PasswordRuleChecklist from "./PasswordRuleChecklist/PasswordRuleChecklist";

const EmailAuthForm: React.FC<EmailAuthFormProps> = props => {
  const { context, className } = props;
  const t = useTranslations("Auth.form");
  const tVal = useTranslations("Auth.form.validation");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const schema = useMemo(() => {
    const msg = {
      required: tVal("required"),
      invalidEmail: tVal("invalidEmail"),
      minLength: (min: number) => tVal("minLength", { min }),
      maxLength: (max: number) => tVal("maxLength", { max }),
      passwordUppercase: tVal("passwordUppercase"),
      passwordLowercase: tVal("passwordLowercase"),
      passwordNumber: tVal("passwordNumber"),
      passwordSpecial: tVal("passwordSpecial")
    };
    return context === "sign-up"
      ? createSignUpEmailSchema(msg)
      : createLoginEmailSchema(msg);
  }, [context, tVal]);

  const formMethods = useForm<EmailSignUpFormSchema | EmailLoginFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });
  const { control, register, formState, handleSubmit } = formMethods;
  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: ""
  });
  const { email, password } = formState.errors ?? {};
  const isSignUp = context === "sign-up";

  const passwordRuleLabels = useMemo(
    () => ({
      uppercase: t("passwordRules.uppercase"),
      lowercase: t("passwordRules.lowercase"),
      number: t("passwordRules.number"),
      special: t("passwordRules.special"),
      minLength: t("passwordRules.minLength")
    }),
    [t]
  );

  const submitHandler = async (
    form: EmailSignUpFormSchema | EmailLoginFormSchema
  ) => {
    const { email, password } = form;
    setIsLoading(true);

    const toastAuthError = (key: AuthFormErrorKey) => {
      toast.error(t(`errors.${key}`));
    };

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      toast.error(t("errors.supabaseConfig"));
      return;
    }

    const supabase = createClient()!;

    try {
      if (context === "login") {
        const result = await signInWithEmailPassword(supabase, email, password);
        if (result.status === "error") {
          toastAuthError(result.errorKey);
          return;
        }
        toast.success(t("loginSuccess"), { duration: 4_000 });
        router.push("/");
        router.refresh();
        return;
      }

      if (context === "sign-up") {
        const result = await signUpWithEmailPassword(supabase, email, password);
        if (result.status === "error") {
          toastAuthError(result.errorKey);
          return;
        }
        if (result.status === "redirect") {
          toast.success(t("loginSuccess"), { duration: 4_000 });
          router.push("/");
          router.refresh();
          return;
        }
        toast.success(t("signUpCheckEmail"), { duration: 12_000 });
      }
    } catch {
      toast.error(t("errors.unexpected"));
    } finally {
      setIsLoading(false);
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
      <PasswordField
        registration={register("password")}
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        errorMessage={password?.message}
        autoComplete={isSignUp ? "new-password" : "current-password"}
        showPasswordLabel={t("showPassword")}
        hidePasswordLabel={t("hidePassword")}
        className={isSignUp ? "mb-4" : "mb-6"}
      />
      {isSignUp && (
        <PasswordRuleChecklist
          rules={evaluatePasswordRules(passwordValue ?? "")}
          labels={passwordRuleLabels}
        />
      )}
      <Button
        className="mb-2"
        glow
        text={isSignUp ? t("submitSignUp") : t("submitLogin")}
        type="submit"
        isLoading={isLoading}
        isDisabled={!isSupabaseConfigured()}
        title={isSupabaseConfigured() ? undefined : t("supabaseDisabledButton")}
      />
    </form>
  );
};

export default EmailAuthForm;
