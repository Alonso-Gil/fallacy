import { Input as NextUIInput } from "@nextui-org/react";
import { forwardRef } from "react";

import { InputProps as Props } from "./Input.types";

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, ...rest } = props;

  return (
    <NextUIInput label={label} ref={ref} {...rest} className={className} />
  );
});

Input.displayName = "Input";

export default Input;
