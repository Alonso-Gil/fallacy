"use client";

import { Mic, MicOff, RefreshCw } from "lucide-react";
import { useState } from "react";

import { useMediaDevices } from "hooks/useMediaDevices";

interface MicCheckProps {
  onReady?: () => void;
  onDenied?: () => void;
}

export const MicCheck = ({ onReady, onDenied }: MicCheckProps) => {
  const {
    audioEnabled,
    audioStream,
    error,
    isPermissionsGranted,
    requestMicPermission,
    toggleAudio
  } = useMediaDevices();

  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const stream = await requestMicPermission();
    setIsRequesting(false);

    if (stream) {
      onReady?.();
    } else {
      onDenied?.();
    }
  };

  const handleRetry = async () => {
    setIsRequesting(true);
    const stream = await requestMicPermission();
    setIsRequesting(false);

    if (stream) {
      onReady?.();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            isPermissionsGranted
              ? "bg-green-100 dark:bg-green-900"
              : "bg-red-100 dark:bg-red-900"
          }`}
        >
          {isPermissionsGranted ? (
            <Mic className="h-12 w-12 text-green-600 dark:text-green-400" />
          ) : (
            <MicOff className="h-12 w-12 text-red-600 dark:text-red-400" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">Microphone Check</h2>
          <p className="text-muted-foreground mt-2">
            {isPermissionsGranted
              ? "Your microphone is ready to use"
              : "Microphone access is required to join the room"}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-950 dark:text-red-400">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {audioStream && audioEnabled && (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">
            Microphone active
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {!isPermissionsGranted ? (
          <button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-6 py-3 disabled:opacity-50"
          >
            {isRequesting ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            {isRequesting ? "Requesting..." : "Enable Microphone"}
          </button>
        ) : (
          <button
            onClick={toggleAudio}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2 rounded-md px-6 py-3"
          >
            {audioEnabled ? (
              <>
                <Mic className="h-5 w-5" />
                Muted
              </>
            ) : (
              <>
                <MicOff className="h-5 w-5" />
                Unmute
              </>
            )}
          </button>
        )}
      </div>

      {isPermissionsGranted && (
        <button
          onClick={handleRetry}
          className="text-muted-foreground hover:text-foreground text-sm underline"
        >
          Retry permission
        </button>
      )}
    </div>
  );
};

export default MicCheck;
