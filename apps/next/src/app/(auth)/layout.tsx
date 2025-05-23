import React from "react";

import { LayoutProps as Props } from "types/common.types";

const AuthLayout: React.FC<Props> = props => {
  const { children } = props;

  return <main className="flex h-full w-full">{children}</main>;
};

export default AuthLayout;
