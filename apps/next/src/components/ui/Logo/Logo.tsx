import { MessageSquareQuote } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import { LogoProps as Props } from "./Logo.types";

const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, "flex items-center gap-3")}>
      <div className="bg-surface text-primary shadow-primary/30 ring-primary/30 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ring-1 ring-inset">
        <MessageSquareQuote className="h-7 w-7" />
      </div>
      <h1 className="text-foreground text-4xl font-semibold tracking-tight">
        Fallacy
      </h1>
    </div>
  );
};

export default Logo;
