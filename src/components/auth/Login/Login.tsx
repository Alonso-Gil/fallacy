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
        "flex flex-1 flex-col items-center p-6 relative animate-fade-in-right-to-left bg-white"
      )}
    >
      <Logo className="absolute top-6 left-6" />
      <div className="flex flex-1 flex-col justify-center w-[400px]">
        <h3 className="text-3xl font-semibold pb-6">Create a new account</h3>
        <p className="pb-8 text-gray-500">
          Register to have access to completely free content
        </p>
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <div className="flex justify-between pb-6">
          <div className="flex gap-2 text-sm">
            <input type="checkbox" className="" />
            <label>Remember me</label>
          </div>
          <p className="text-sm text-palette font-semibold">Forgot password</p>
        </div>
        <button className="h-12 rounded-xl bg-palette  text-white mb-4">
          Sign in
        </button>
        <button className="h-12 rounded-xl mb-4 border-2 flex items-center justify-center text-black gap-3 font-medium">
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
