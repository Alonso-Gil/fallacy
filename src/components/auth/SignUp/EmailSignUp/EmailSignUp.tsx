"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { getOtpEmailSchema } from "./EmailSignUp.helpers";
import { EmailSignUpProps as Props } from "./EmailSignUp.types";
import { EmailSignUpFormSchema } from "./EmailSignUp.types";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";

const EmailSignUp: React.FC<Props> = ({ className }) => {
  const otpEmailFormMethods = useForm<EmailSignUpFormSchema>({
    mode: "onBlur",
    resolver: yupResolver(getOtpEmailSchema()),
  });
  const { register, formState, handleSubmit } = otpEmailFormMethods;
  const { email, password } = formState.errors ?? {};
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (form: EmailSignUpFormSchema) => {
    setIsLoading(true);
    try {
      // TODO: Agregar el Provider de correo
      console.log({ form });
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
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
      />
      <Input
        {...register("password")}
        className="mb-6"
        label="Password"
        type="password"
        errorMessage={password?.message}
      />
      <div className="flex justify-between pb-6">
        <Checkbox defaultSelected>Remember me</Checkbox>
        <Link className="text-palette text-sm font-semibold" href={"/sign-up"}>
          Forgot password?
        </Link>
      </div>
      <Button
        className="mb-6"
        text="Sign Up"
        type="submit"
        isLoading={isLoading}
      />
    </form>
  );
};

export default EmailSignUp;
