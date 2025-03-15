import React from "react";
import { twMerge } from "tailwind-merge";

import { MainProps as Props } from "./Main.types";

const Main: React.FC<Props> = (props) => {
  const { className, children } = props;

  return (
    <main
      className={twMerge(
        "Main flex flex-1 bg-background-contrast dark:bg-background-dark",
        className,
      )}
    >
      {children}
    </main>
  );
};

export default Main;
