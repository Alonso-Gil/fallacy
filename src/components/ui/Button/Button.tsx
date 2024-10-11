import { Button as ButtonNextUI } from "@nextui-org/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { ButtonProps as Props } from "./Button.types";

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, text, icon, children, ...rest } = props;

  return (
    <ButtonNextUI
      className={twMerge(
        "h-12 w-full bg-background-primary text-base font-medium text-white dark:bg-background-dark-contrast",
        className,
      )}
      ref={ref}
      {...rest}
    >
      {icon}
      {text ?? children}
    </ButtonNextUI>
  );
});

Button.displayName = "Button";

export default Button;
