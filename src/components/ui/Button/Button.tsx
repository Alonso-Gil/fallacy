import { Button as ButtonNextUI } from "@nextui-org/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { ButtonProps as Props } from "./Button.types";

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, text, ...rest } = props;

  return (
    <ButtonNextUI
      className={twMerge(
        className,
        "h-12 w-full bg-background-primary text-base text-white dark:bg-background-dark-contrast",
      )}
      ref={ref}
      {...rest}
    >
      {text}
    </ButtonNextUI>
  );
});

Button.displayName = "Button";

export default Button;
