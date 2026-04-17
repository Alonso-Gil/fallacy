import React from "react";

import { cn } from "lib/utils";
import { MainProps as Props } from "./Main.types";

const Main: React.FC<Props> = props => {
  const { className, children } = props;

  return <main className={cn("Main flex flex-1", className)}>{children}</main>;
};

export default Main;
