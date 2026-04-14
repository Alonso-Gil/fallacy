import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

import AuthButton from "ui/AuthButton/AuthButton";
import Logo from "ui/Logo/Logo";
import EmailSignUp from "./EmailAuthForm/EmailAuthForm";
import { SignUpProps as Props } from "./SignUp.types";

const SignUp: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "SignUp bg-background dark:bg-background-dark-primary flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6"
      )}
    >
      <Logo className="md:self-start" />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h3 className="text-typography pt-4 pb-6 font-semibold lg:pt-20 dark:text-white">
          Get started
        </h3>
        <p className="text-typography-soft pb-8">Create a new account</p>
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
        <hr className="border-border my-6 w-full" />
        <EmailSignUp context="signUp" className="mb-4 w-full" />
        <Link className="text-center" href={"/login"}>
          <p>
            Have an account? <span className="underline">Login Now</span>
          </p>
        </Link>
      </div>
      <p className="text-sm">
        &copy; Fallacy. Todos los derechos reservados.{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default SignUp;
