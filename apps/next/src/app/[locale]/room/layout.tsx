import RouteViewportLayout from "components/layout/RouteViewportLayout";

import type { ReactNode } from "react";

const RoomLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => {
  return <RouteViewportLayout>{children}</RouteViewportLayout>;
};

export default RoomLayout;
