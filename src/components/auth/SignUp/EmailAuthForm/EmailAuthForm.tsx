"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { getLoginEmailSchema } from "./EmailAuthForm.helpers";
import { getSignUpEmailSchema } from "./EmailAuthForm.helpers";
import { EmailAuthFormProps } from "./EmailAuthForm.types";
import { EmailLoginFormSchema } from "./EmailAuthForm.types";
import { EmailSignUpFormSchema } from "./EmailAuthForm.types";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { createClient } from "@/utils/supabase/component";

const EmailAuthForm: React.FC<EmailAuthFormProps> = (props) => {
  const { context, className } = props;
  const supabase = createClient();
  const schema =
    context === "signUp" ? getSignUpEmailSchema() : getLoginEmailSchema();
  const formMethods = useForm<EmailSignUpFormSchema | EmailLoginFormSchema>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const { register, formState, handleSubmit } = formMethods;
  const { email, password } = formState.errors ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { push } = useRouter();

  const submitHandler = async (
    form: EmailSignUpFormSchema | EmailLoginFormSchema,
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    const { email, password } = form;
    try {
      if (context === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!!data && !error) {
          push("/");
        } else {
          setErrorMessage(error?.message ?? "Invalid email or password");
          setIsLoading(false);
        }
      }

      if (context === "signUp") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        // TODO: Cambiar cuando se agregue zustand user
        if (!!data && !error) {
          push("/");
        } else {
          setErrorMessage(error?.message ?? "Invalid email or password");
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit(submitHandler)}>
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
      {context === "signUp" && (
        <Input
          {...register("repeatPassword")}
          className="mb-6"
          label="Repeat Password"
          type="password"
          errorMessage={(formState.errors as any)?.repeatPassword?.message}
          placeholder="********"
        />
      )}
      <Button
        className="mb-2"
        text={context === "signUp" ? "Sign Up" : "Login"}
        type="submit"
        isLoading={isLoading}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default EmailAuthForm;
