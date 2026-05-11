"use client";

import {
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Video,
  VideoOff
} from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreen?: () => void;
  onLeave: () => void;
}

export const VideoControls = ({
  isMuted,
  isVideoEnabled,
  onToggleMute,
  onToggleVideo,
  onToggleScreen,
  onLeave
}: VideoControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <button
        onClick={onToggleMute}
        className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
          isMuted
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMuted ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>

      <button
        onClick={onToggleVideo}
        className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
          !isVideoEnabled
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
        aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {isVideoEnabled ? (
          <Video className="h-6 w-6 text-white" />
        ) : (
          <VideoOff className="h-6 w-6 text-white" />
        )}
      </button>

      {onToggleScreen && (
        <button
          onClick={onToggleScreen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600 transition-colors hover:bg-gray-700"
          aria-label="Share screen"
        >
          <MonitorUp className="h-6 w-6 text-white" />
        </button>
      )}

      <button
        onClick={onLeave}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
        aria-label="Leave room"
      >
        <PhoneOff className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default VideoControls;
