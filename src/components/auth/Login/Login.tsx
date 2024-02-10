import { Checkbox, Divider } from "@nextui-org/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { LoginProps } from "./Login.types";
import SignInButton from "../sign-in-button";
import Input from "@/components/ui/Input/Input";
import Logo from "@/components/ui/Logo/Logo";

import GoogleSVG from "images/google.svg";

const Login: React.FC<LoginProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        className,
        "flex flex-1 flex-col items-center p-6 relative animate-fade-in-right-to-left bg-background dark:bg-background-dark duration-200"
      )}
    >
      <Logo className="absolute top-6 left-6" />
      <div className="flex flex-1 flex-col justify-center w-[400px]">
        <h3 className="text-3xl font-semibold pb-6 text-typography dark:text-white">
          Create a new account
        </h3>
        <p className="pb-8 text-typography-soft">
          Register to have access to completely free content
        </p>
        <Input label="Email" type="email" className="mb-6" />
        <Input label="Password" type="password" className="mb-6" />
        <div className="flex justify-between pb-6">
          <Checkbox defaultSelected>Remember me</Checkbox>
          <Link
            className="text-sm text-palette font-semibold"
            href={"/sign-up"}
          >
            Forgot password
          </Link>
        </div>
        <button className="h-12 rounded-xl bg-background-primary text-typography-white mb-6 dark:bg-background-dark-contrast">
          Sign in
        </button>
        <Divider className="mb-6" />
        <button className="h-12 rounded-xl mb-4 border-2 flex items-center justify-center text-typography gap-3 font-medium dark:text-typography-white dark:bg-background-dark-contrast dark:border-background-dark-contrast">
          <GoogleSVG className="w-6 h-6" />
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

export default Login;
