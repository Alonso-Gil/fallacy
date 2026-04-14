import React from "react";
import { twMerge } from "tailwind-merge";

import { MainProps as Props } from "./Main.types";

const Main: React.FC<Props> = props => {
  const { className, children } = props;

  return (
    <main
      className={twMerge(
        "Main bg-background-contrast dark:bg-background-dark flex flex-1",
        className
      )}
    >
      {children}
    </main>
  );
};

export default Main;
