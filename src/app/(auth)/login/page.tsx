import React from "react";

import RandomFallacy from "@/components/RandomFallacy/RandomFallacy";
import Login from "@/components/auth/Login/Login";

const SignInPage: React.FC = () => {
  return (
    <div className="Login flex flex-1">
      <div className="hidden flex-1 animate-fade-in items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
      <Login className="animate-fade-in-right-to-left border-r dark:border-border-color" />
    </div>
  );
};

export default SignInPage;
