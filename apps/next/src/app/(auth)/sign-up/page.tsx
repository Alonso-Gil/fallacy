import React from "react";

import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import SignUp from "components/auth/SignUp/SignUp";

const SignUpPage = () => {
  return (
    <div className="SignUpPage flex flex-1">
      <SignUp className="animate-fade-in-right-to-left border-r dark:border-border-color" />
      <div className="hidden flex-1 animate-fade-in items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
    </div>
  );
};

export default SignUpPage;
