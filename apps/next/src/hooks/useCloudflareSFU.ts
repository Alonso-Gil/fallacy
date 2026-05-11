"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SFUPeer {
  participantId: string;
  stream: MediaStream | null;
}

interface UseCloudflareSFUOptions {
  accessToken: string | null;
  localStream: MediaStream | null;
  roomId: string;
}

type SfuSessionDescription = {
  type: "offer" | "answer";
  sdp: string;
};

const ICE_SERVERS = [{ urls: "stun:stun.cloudflare.com:3478" }];

export const useCloudflareSFU = ({
  accessToken,
  localStream,
  roomId
}: UseCloudflareSFUOptions) => {
  const [peers, setPeers] = useState<Map<string, SFUPeer>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const peersRef = useRef<Map<string, SFUPeer>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const accessTokenRef = useRef<string | null>(accessToken);
  const reconnectAttemptsRef = useRef(0);
  const intentionalCloseRef = useRef(false);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const updatePeerStream = useCallback(
    (participantId: string, stream: MediaStream) => {
      console.log("[SFU] track received for:", participantId);
      const peer: SFUPeer = { participantId, stream };
      peersRef.current.set(participantId, peer);
      setPeers(prev => {
        const next = new Map(prev);
        next.set(participantId, peer);
        return next;
      });
    },
    []
  );

  const cleanup = useCallback(() => {
    console.log("[SFU] cleanup");
    intentionalCloseRef.current = true;
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    peersRef.current.clear();
    setPeers(new Map());
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const joinSFU = useCallback(
    async (pc: RTCPeerConnection) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const currentAccessToken = accessTokenRef.current;

        if (!apiUrl || !currentAccessToken) {
          throw new Error("SFU API is not configured");
        }

        await pc.setLocalDescription(await pc.createOffer());
        const offer = pc.localDescription;
        if (!offer?.sdp) {
          throw new Error("Failed to create SFU offer");
        }

        const url = `${apiUrl}/room/${roomId}/sfu/session`;
        console.log("[SFU] creating session through API:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sessionDescription: {
              type: offer.type,
              sdp: offer.sdp
            }
          })
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `SFU join failed (${response.status}): ${text || response.statusText}`
          );
        }

        const data = (await response.json()) as {
          sessionDescription?: SfuSessionDescription;
          sessionId?: string;
        } | null;

        if (!data?.sessionDescription) {
          throw new Error("SFU did not return a session description");
        }

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.sessionDescription)
        );

        console.log("[SFU] session created:", data.sessionId ?? "(no id)");
        setIsConnected(true);
        setError(null);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to join SFU";
        setError(message);
        toast.error(message);
        return false;
      }
    },
    [roomId]
  );

  const setupPeerConnection = useCallback((): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    }

    pc.ontrack = event => {
      const remoteStream = event.streams[0];
      if (!remoteStream) return;

      const streamId = remoteStream.id;
      const mid = event.transceiver?.mid;
      const participantId = mid || streamId || "unknown";
      console.log("[SFU] ontrack:", { streamId, mid, participantId });

      updatePeerStream(participantId, remoteStream);
    };

    pc.onicecandidate = event => {
      if (!event.candidate) console.log("[SFU] ICE gathering complete");
    };

    pc.onconnectionstatechange = () => {
      console.log("[SFU] connectionState:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setIsConnected(false);
        if (pc.connectionState === "failed") {
          toast.error("WebRTC connection failed");
        }
      }
    };

    pc.onnegotiationneeded = async () => {
      console.log("[SFU] negotiation needed");
    };

    return pc;
  }, [updatePeerStream]);

  useEffect(() => {
    if (!roomId || !accessToken || !localStream) return;

    let cancelled = false;
    intentionalCloseRef.current = false;

    const init = async () => {
      const pc = setupPeerConnection();
      pcRef.current = pc;
      if (cancelled) return;

      const joined = await joinSFU(pc);
      if (!joined && !cancelled) {
        cleanup();
      }
    };

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [roomId, accessToken, localStream, joinSFU, setupPeerConnection, cleanup]);

  const reconnect = useCallback(async () => {
    intentionalCloseRef.current = false;
    cleanup();
    reconnectAttemptsRef.current = 0;

    const pc = setupPeerConnection();
    pcRef.current = pc;

    const joined = await joinSFU(pc);
    if (!joined) {
      cleanup();
    }
  }, [joinSFU, setupPeerConnection, cleanup]);

  return { peers, isConnected, error, cleanup, reconnect };
};
