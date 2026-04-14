"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "ui/Button/Button";
import Input from "ui/Input/Input";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/component";
import {
  getLoginEmailSchema,
  getSignUpEmailSchema
} from "./EmailAuthForm.helpers";
import type {
  EmailAuthFormProps,
  EmailLoginFormSchema,
  EmailSignUpFormSchema
} from "./EmailAuthForm.types";

const EmailAuthForm: React.FC<EmailAuthFormProps> = props => {
  const { context, className } = props;
  const schema =
    context === "signUp" ? getSignUpEmailSchema() : getLoginEmailSchema();
  const formMethods = useForm<EmailSignUpFormSchema | EmailLoginFormSchema>({
    mode: "onBlur",
    resolver: zodResolver(schema)
  });
  const { register, formState, handleSubmit } = formMethods;
  const { email, password } = formState.errors ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const submitHandler = async (
    form: EmailSignUpFormSchema | EmailLoginFormSchema
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      setErrorMessage(
        "Autenticación por email desactivada: configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver config/supabase)."
      );
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage("Cliente Supabase no disponible.");
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
        } else {
          setErrorMessage(error?.message ?? "Invalid email or password");
          setIsLoading(false);
        }
      }

      if (context === "signUp") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (!!data && !error) {
          router.push("/");
        } else {
          setErrorMessage(error?.message ?? "Invalid email or password");
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(`An unexpected error occurred: ${error}`);
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
        label="Email"
        type="email"
        errorMessage={email?.message}
        placeholder="email@example.com"
      />
      <Input
        {...register("password")}
        className="mb-6"
        label="Password"
        type="password"
        errorMessage={password?.message}
        placeholder="********"
      />
      <Button
        className="mb-2"
        text={context === "signUp" ? "Sign Up" : "Login"}
        type="submit"
        isLoading={isLoading}
        isDisabled={!isSupabaseConfigured()}
        title={
          isSupabaseConfigured()
            ? undefined
            : "TODO: configura Supabase en .env"
        }
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default EmailAuthForm;
