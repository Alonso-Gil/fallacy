import { MessageSquareQuote } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import { LogoProps as Props } from "./Logo.types";

const Logo: React.FC<Props> = props => {
  const { className, description, variant = "default" } = props;
  const isCompact = variant === "compact";

  const iconShell = cn(
    "shadow-primary/18 ring-primary/22 from-primary/14 to-surface-secondary dark:from-primary/[0.2] dark:to-surface-secondary flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-1 ring-inset",
    isCompact ? "h-12 w-12" : "h-14 w-14"
  );

  const titleClass = cn(
    "text-foreground font-semibold tracking-tight",
    isCompact ? "text-xl leading-none" : "text-4xl"
  );

  return (
    <div className={cn(className, "flex items-center gap-3")}>
      <div className={iconShell}>
        <MessageSquareQuote
          className={cn("text-primary", isCompact ? "h-6 w-6" : "h-7 w-7")}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        {isCompact ? (
          <span className={titleClass}>Fallacy</span>
        ) : (
          <h1 className={titleClass}>Fallacy</h1>
        )}
        {description ? (
          <span className="text-text-secondary/80 truncate text-xs leading-tight">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Logo;
