import { Checkbox, Divider } from "@nextui-org/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { LoginProps } from "./Login.types";
import EmailSignUp from "../SignUp/EmailSignUp/EmailSignUp";
import SignInButton from "../sign-in-button";
import Logo from "@/components/ui/Logo/Logo";

import GoogleSVG from "images/google.svg";

const Login: React.FC<LoginProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "Login flex flex-1 flex-col items-center overflow-y-auto bg-background p-2 dark:bg-background-dark-primary md:p-6",
      )}
    >
      <Logo className="md:self-start" />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h1 className="pb-6 pt-4 font-semibold text-typography dark:text-white lg:pt-20">
          Welcome back
        </h1>
        <p className="pb-8 text-typography-soft">Sign in to your account</p>
        <EmailSignUp className="w-full" />
        <Divider className="mb-6" />
        <button className="mb-4 flex h-12 items-center justify-center gap-3 rounded-xl border font-medium text-typography dark:border-background-dark-primary dark:bg-background-dark-contrast dark:text-white">
          <GoogleSVG className="h-6 w-6" />
          Sign in with google
        </button>
        <SignInButton />
      </div>
      <p className="self-start text-sm">
        &copy; Fallacy. Todos los derechos reservados.{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Login;
