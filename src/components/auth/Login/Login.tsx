"use client";
import { Divider } from "@nextui-org/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { LoginProps as Props } from "./Login.types";
import EmailSignUp from "../SignUp/EmailAuthForm/EmailAuthForm";
import AuthButton from "@/components/ui/AuthButton/AuthButton";
import Logo from "@/components/ui/Logo/Logo";

import GoogleSVG from "images/google.svg";

const Login: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "Login flex flex-1 flex-col items-center justify-between overflow-y-auto bg-background p-2 dark:bg-background-dark-primary md:p-6",
      )}
    >
      <Logo className="md:self-start" />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h1 className="pb-6 pt-4 font-semibold text-typography dark:text-white lg:pt-20">
          Welcome back
        </h1>
        <p className="pb-8 text-typography-soft">Sign in to your account</p>
        <AuthButton
          signInIcon={<GoogleSVG className="h-6 w-6" />}
          signInProvider="google"
        />
        <Divider className="my-8" />
        <EmailSignUp context="login" className="mb-4 w-full" />
        <Link className="text-center" href={"/sign-up"}>
          <p>
            Don&lsquo;t have an account?{" "}
            <span className="underline">Sign Up Now</span>
          </p>
        </Link>
      </div>
      <p className="text-sm">
        &copy; Fallacy. All rights reserved.{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Login;
