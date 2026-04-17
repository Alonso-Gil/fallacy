import { forwardRef, useId } from "react";

import { Input as ShadcnInput } from "components/ui/input";
import { cn } from "lib/utils";
import { InputProps as Props } from "./Input.types";

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, errorMessage, id: idProp, ...rest } = props;
  const uid = useId();
  const inputId = idProp ?? uid;

  return (
    <div className={cn("grid w-full gap-2", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      ) : null}
      <ShadcnInput
        id={inputId}
        ref={ref}
        aria-invalid={errorMessage ? true : undefined}
        {...rest}
        className="border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35"
      />
      {errorMessage ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
