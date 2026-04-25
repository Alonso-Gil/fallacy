import { Loader2 } from "lucide-react";
import { type ComponentRef, forwardRef } from "react";

import { Button as ShadcnButton } from "ui/shadcnComponents/button";
import { cn } from "lib/utils";
import { ButtonProps as Props } from "./Button.types";

const Button = forwardRef<ComponentRef<typeof ShadcnButton>, Props>(
  (props, ref) => {
    const {
      className,
      text,
      icon,
      children,
      isDisabled,
      isLoading,
      disabled,
      glow,
      ...rest
    } = props;

    return (
      <ShadcnButton
        className={cn(
          "bg-primary hover:bg-primary-hover text-primary-foreground h-12 w-full text-base font-medium",
          glow &&
            "shadow-primary/25 hover:shadow-primary/35 shadow-md transition-shadow hover:shadow-md",
          className
        )}
        ref={ref}
        disabled={disabled ?? isDisabled ?? isLoading}
        {...rest}
      >
        {isLoading ? (
          <Loader2 className="mr-2 size-4 shrink-0 animate-spin" aria-hidden />
        ) : (
          icon
        )}
        {text ?? children}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
