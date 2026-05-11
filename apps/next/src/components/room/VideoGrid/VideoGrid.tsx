"use client";

import { type ReactNode } from "react";

interface VideoGridProps {
  children: ReactNode;
}

export const VideoGrid = ({ children }: VideoGridProps) => {
  return (
    <div className="grid h-full flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {children}
    </div>
  );
};

export default VideoGrid;
