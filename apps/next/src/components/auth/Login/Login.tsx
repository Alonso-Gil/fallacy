"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

import AuthButton from "ui/AuthButton/AuthButton";
import Logo from "ui/Logo/Logo";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import EmailSignUp from "../SignUp/EmailAuthForm/EmailAuthForm";
import { LoginProps as Props } from "./Login.types";

const Login: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "Login bg-background dark:bg-background-dark-primary flex flex-1 flex-col items-center justify-between overflow-y-auto p-2 md:p-6"
      )}
    >
      <Logo className="md:self-start" />
      <RandomFallacy />
      <div className="flex w-full max-w-[400px] flex-1 flex-col justify-center pb-6">
        <h1 className="text-typography pt-4 pb-6 font-semibold lg:pt-20 dark:text-white">
          Welcome back
        </h1>
        <p className="text-typography-soft pb-8">Sign in to your account</p>
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
        <hr className="border-border my-8 w-full" />
        <EmailSignUp context="login" className="mb-4 w-full" />
        <Link className="text-center" href={"/sign-up"}>
          <p>
            Don&lsquo;t have an account?{" "}
            <span className="underline">Sign Up Now</span>
          </p>
        </Link>
      </div>
      <p className="text-sm">
        &copy; Fallacy. All rights reserved. {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Login;
