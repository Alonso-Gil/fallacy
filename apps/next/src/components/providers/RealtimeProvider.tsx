/* eslint-disable no-undef -- WebRTC types are global DOM types */
/*
 * NOTE: This provider wraps the room layout but is currently unused
 * by the room page. The room page manages Supabase Realtime channels
 * directly. This provider is kept for potential future use if the
 * signaling layer is unified with useWebRTCMesh / useRoomRealtime.
 */
"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";

import { createRealtimeClient } from "utils/supabase/component";

export type RealtimeEvent = {
  type: "USER_JOINED" | "USER_LEFT" | "OFFER" | "ANSWER" | "ICE_CANDIDATE";
  payload: Record<string, unknown>;
};

export type Participant = {
  userId: string;
  role: "host" | "guest";
  joinedAt: string;
};

export type RealtimeContextValue = {
  isConnected: boolean;
  participants: Participant[];
  channel: RealtimeChannel | null;
  sendOffer: (offer: RTCSessionDescriptionInit) => void;
  sendAnswer: (answer: RTCSessionDescriptionInit) => void;
  sendIceCandidate: (candidate: RTCIceCandidate) => void;
  subscribe: (roomId: string, userId: string) => void;
  unsubscribe: () => void;
};

export const RealtimeContext = createContext<RealtimeContextValue | null>(null);

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  // These are kept for potential future use when the provider is wired up
  const [_roomId, _setRoomId] = useState<string | null>(null);
  const [_currentUserId, _setCurrentUserId] = useState<string | null>(null);

  const handleUserJoined = useCallback((payload: { new: Participant }) => {
    setParticipants(prev => {
      const exists = prev.some(p => p.userId === payload.new.userId);
      if (exists) return prev;
      return [...prev, payload.new];
    });
  }, []);

  const handleUserLeft = useCallback((payload: { old: { userId: string } }) => {
    setParticipants(prev => prev.filter(p => p.userId !== payload.old.userId));
  }, []);

  const handleOffer = useCallback(
    (payload: { payload: RTCSessionDescriptionInit }) => {
      window.dispatchEvent(
        new CustomEvent("webrtc:offer", { detail: payload.payload })
      );
    },
    []
  );

  const handleAnswer = useCallback(
    (payload: { payload: RTCSessionDescriptionInit }) => {
      window.dispatchEvent(
        new CustomEvent("webrtc:answer", { detail: payload.payload })
      );
    },
    []
  );

  const handleIceCandidate = useCallback(
    (payload: { payload: RTCIceCandidateInit }) => {
      window.dispatchEvent(
        new CustomEvent("webrtc:ice-candidate", { detail: payload.payload })
      );
    },
    []
  );

  const subscribe = useCallback(
    (newRoomId: string, userId: string) => {
      const client = createRealtimeClient();
      if (!client) {
        console.error("Realtime client not configured");
        return;
      }

      if (channel) {
        client.removeChannel(channel);
      }

      const newChannel = client.channel(`room:${newRoomId}`);

      newChannel
        .on(
          "broadcast",
          { event: "USER_JOINED" },
          handleUserJoined as () => void
        )
        .on("broadcast", { event: "USER_LEFT" }, handleUserLeft as () => void)
        .on("broadcast", { event: "OFFER" }, handleOffer as () => void)
        .on("broadcast", { event: "ANSWER" }, handleAnswer as () => void)
        .on(
          "broadcast",
          { event: "ICE_CANDIDATE" },
          handleIceCandidate as () => void
        )
        .subscribe(status => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else if (status === "CHANNEL_ERROR") {
            setIsConnected(false);
          }
        });

      setChannel(newChannel);
      _setRoomId(newRoomId);
      _setCurrentUserId(userId);
    },
    [
      channel,
      handleUserJoined,
      handleUserLeft,
      handleOffer,
      handleAnswer,
      handleIceCandidate
    ]
  );

  const unsubscribe = useCallback(() => {
    if (channel) {
      const client = createRealtimeClient();
      if (client) {
        client.removeChannel(channel);
      }
    }
    setChannel(null);
    setIsConnected(false);
    setParticipants([]);
    _setRoomId(null);
    _setCurrentUserId(null);
  }, [channel]);

  const sendOffer = useCallback(
    (offer: RTCSessionDescriptionInit) => {
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "OFFER",
          payload: offer
        });
      }
    },
    [channel]
  );

  const sendAnswer = useCallback(
    (answer: RTCSessionDescriptionInit) => {
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "ANSWER",
          payload: answer
        });
      }
    },
    [channel]
  );

  const sendIceCandidate = useCallback(
    (candidate: RTCIceCandidate) => {
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "ICE_CANDIDATE",
          payload: candidate
        });
      }
    },
    [channel]
  );

  useEffect(() => {
    return () => {
      if (channel) {
        const client = createRealtimeClient();
        if (client) {
          client.removeChannel(channel);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        participants,
        channel,
        sendOffer,
        sendAnswer,
        sendIceCandidate,
        subscribe,
        unsubscribe
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};
