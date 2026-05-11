"use client";

import { Loader2 } from "lucide-react";

const RoomLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
};

export default RoomLoading;
