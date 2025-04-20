import React from "react";
import { twMerge } from "tailwind-merge";

import { LogoProps as Props } from "./Logo.types";

const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge(className, "")}>
      <h1 className="text-4xl">Fallacy</h1>
    </div>
  );
};

export default Logo;
