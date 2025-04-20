import { Divider } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

import EmailSignUp from "./EmailAuthForm/EmailAuthForm";
import { SignUpProps as Props } from "./SignUp.types";
import AuthButton from "ui/AuthButton/AuthButton";
import Logo from "ui/Logo/Logo";

import GoogleSVG from "images/google.svg";

const SignUp: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "SignUp flex flex-1 flex-col items-center justify-between overflow-y-auto bg-background p-2 dark:bg-background-dark-primary md:p-6"
      )}
    >
      <Logo className="md:self-start" />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h3 className="pb-6 pt-4 font-semibold text-typography dark:text-white lg:pt-20">
          Get started
        </h3>
        <p className="pb-8 text-typography-soft">Create a new account</p>
        <AuthButton
          signInIcon={<GoogleSVG className="h-6 w-6" />}
          signInProvider="google"
        />
        <Divider className="my-6" />
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
