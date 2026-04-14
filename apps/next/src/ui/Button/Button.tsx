import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { Button as ShadcnButton } from "components/ui/button";
import { ButtonProps as Props } from "./Button.types";

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    className,
    text,
    icon,
    children,
    isDisabled,
    isLoading,
    disabled,
    ...rest
  } = props;

  return (
    <ShadcnButton
      className={twMerge(
        "bg-background-primary dark:bg-background-dark-contrast h-12 w-full text-base font-medium text-white",
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
});

Button.displayName = "Button";

export default Button;
