"use client";

import { Mic, MicOff, User } from "lucide-react";
import { useEffect, useRef } from "react";

interface ParticipantVideoProps {
  srcObject?: MediaStream | null;
  userId: string;
  role: "host" | "guest";
  isMuted?: boolean;
  isLocal?: boolean;
  name?: string;
}

export const ParticipantVideo = ({
  srcObject,
  userId: _userId,
  role,
  isMuted = false,
  isLocal = false,
  name
}: ParticipantVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return (
    <div className="bg-muted relative flex aspect-video items-center justify-center overflow-hidden rounded-lg">
      {srcObject ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
          <User className="h-16 w-16 text-gray-400" />
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-black/60 px-3 py-1.5">
        <span className="text-sm font-medium text-white">
          {name || (role === "host" ? "Host" : "Guest")}
        </span>
        {isMuted && <MicOff className="h-4 w-4 text-red-500" />}
        {!isMuted && isLocal && <Mic className="h-4 w-4 text-white" />}
      </div>

      {isLocal && (
        <span className="absolute top-2 right-2 rounded-md bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
          You
        </span>
      )}
    </div>
  );
};

export default ParticipantVideo;
