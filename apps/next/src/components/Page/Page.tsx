import React from "react";
import { twMerge } from "tailwind-merge";

import { PageProps as Props } from "./Page.types";

const Page: React.FC<Props> = props => {
  const { className, children } = props;

  return (
    <div
      className={twMerge(
        "Page h-screen-dynamic flex min-h-full flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Page;
