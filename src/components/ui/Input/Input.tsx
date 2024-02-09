import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { InputProps as Props } from "./Input.typers";

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, ...rest } = props;

  return (
    <div className={twMerge(className, "flex flex-col gap-2 text-sm pb-4")}>
      <label>{label}</label>
      <input ref={ref} {...rest} className="border-2 rounded-xl h-12" />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
