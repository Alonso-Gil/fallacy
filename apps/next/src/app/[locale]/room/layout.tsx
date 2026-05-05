import { type ReactNode } from "react";

const RoomLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default RoomLayout;
