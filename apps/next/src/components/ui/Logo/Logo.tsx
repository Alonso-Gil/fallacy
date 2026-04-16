import React from "react";

import { cn } from "lib/utils";
import { LogoProps as Props } from "./Logo.types";

const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <h1 className="text-foreground text-4xl font-semibold tracking-tight">
        Fallacy
      </h1>
    </div>
  );
};

export default Logo;
