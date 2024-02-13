import React from "react";
import { twMerge } from "tailwind-merge";

import EmailSignUp from "./EmailSignUp/EmailSignUp";
import { SignUpProps as Props } from "./SignUp.types";
import SignInButton from "@/components/auth/sign-in-button";
import Logo from "@/components/ui/Logo/Logo";

import GoogleSVG from "images/google.svg";

const SignUp: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "relative flex flex-1 animate-fade-in-right-to-left flex-col items-center bg-white p-6",
      )}
    >
      <Logo className="absolute left-6 top-6" />
      <div className="flex w-[400px] flex-1 flex-col justify-center">
        <h3 className="pb-6 text-3xl font-semibold">Login with your account</h3>
        <p className="pb-8 text-gray-500">
          Register to have access to completely free content
        </p>
        <EmailSignUp />
        <button className="mb-4 flex h-12 items-center justify-center gap-3 rounded-xl border-2 font-medium text-black">
          <GoogleSVG className="h-6 w-6" />
          Sign in with google
        </button>
        <SignInButton />
      </div>
      <p className="absolute bottom-6 left-6 text-sm">
        &copy; Fallacy. Todos los derechos reservados.{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default SignUp;
