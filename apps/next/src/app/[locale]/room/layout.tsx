"use client";

import { type ReactNode } from "react";

import { RealtimeProvider } from "components/providers/RealtimeProvider";

const RoomLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <RealtimeProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </RealtimeProvider>
  );
};

export default RoomLayout;
