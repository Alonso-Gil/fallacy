import RouteViewportLayout from "components/layout/RouteViewportLayout";

import type { ReactNode } from "react";

const HomeLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => {
  return <RouteViewportLayout>{children}</RouteViewportLayout>;
};

export default HomeLayout;
