import React from "react";

import Login from "@/components/auth/Login/Login";

const SignInPage: React.FC = (props) => {
  return (
    <div className="flex flex-1 bg-background">
      <Login className="w-1/2" />
      <div className="w-1/2 flex flex-1 items-center justify-center">
        Prueba
      </div>
    </div>
  );
};

export default SignInPage;
