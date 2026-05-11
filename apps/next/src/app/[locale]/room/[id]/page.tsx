"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { ParticipantVideo } from "components/room/ParticipantVideo/ParticipantVideo";
import { VideoControls } from "components/room/VideoControls/VideoControls";
import { VideoGrid } from "components/room/VideoGrid/VideoGrid";
import useAccessToken from "hooks/useAccessToken";
import { useCloudflareSFU } from "hooks/useCloudflareSFU";
import { useMediaDevices } from "hooks/useMediaDevices";
import { createRealtimeClient } from "utils/supabase/component";
import { useRoomSessionStore } from "store/roomSession/roomSession.store";

type WebRtcSessionDescription = {
  type: "offer" | "answer" | "pranswer" | "rollback";
  sdp?: string;
};

type WebRtcIceCandidate = {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
};

const ICE_SERVERS = [{ urls: "stun:stun.cloudflare.com:3478" }];
const STREAM_SETUP_TIMEOUT_MS = 15_000;

interface P2PPeerInfo {
  connection: RTCPeerConnection;
  stream: MediaStream | null;
}

const RoomPage = () => {
  const t = useTranslations("Lobby");
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const { getAccessToken } = useAccessToken();

  const session = useRoomSessionStore(s => s.session);
  const clearSession = useRoomSessionStore(s => s.clearSession);

  const userId = session.userId;
  const role = session.role;
  const sfuEnabled = session.sfuEnabled;

  const {
    audioEnabled,
    videoEnabled,
    requestPermissions,
    toggleAudio,
    toggleVideo,
    setStream,
    stopAll
  } = useMediaDevices();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [apiAccessToken, setApiAccessToken] = useState<string | null>(null);

  const sfu = useCloudflareSFU({
    accessToken: apiAccessToken,
    localStream,
    roomId
  });
  const sfuCleanup = sfu?.cleanup;
  const useSfuMode = sfuEnabled && !!userId && !sfu?.error;

  // Fall back to P2P if SFU fails with an auth/connection error
  useEffect(() => {
    if (sfuEnabled && sfu?.error) {
      console.warn("[Room] SFU failed, falling back to P2P mode:", sfu.error);
      sfuCleanup?.();
    }
  }, [sfu?.error, sfuEnabled, sfuCleanup]);

  const [peers, setPeers] = useState<Map<string, P2PPeerInfo>>(new Map());
  const [isWaitingForPeer, setIsWaitingForPeer] = useState(false);

  const peersRef = useRef<Map<string, P2PPeerInfo>>(new Map());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const processedUserIdsRef = useRef<Set<string>>(new Set());
  const localStreamRef = useRef<MediaStream | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const initializedP2PRef = useRef(false);
  const leaveCalledRef = useRef(false);
  const doLeaveRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  useEffect(() => {
    getAccessToken().then(result => {
      if (result.status === "ok") {
        accessTokenRef.current = result.accessToken;
        setApiAccessToken(result.accessToken);
      }
    });
  }, [getAccessToken]);

  // === Acquire media stream via useMediaDevices (single source of truth) ===
  useEffect(() => {
    if (!userId) return;

    console.log(
      "[Room] init — mode:",
      useSfuMode ? "SFU" : "P2P",
      "userId:",
      userId,
      "roomId:",
      roomId
    );

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const initStream = async () => {
      const stream = await requestPermissions();
      if (cancelled) return;

      if (!stream) {
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            setMediaError(t("room.mediaError"));
          }
        }, STREAM_SETUP_TIMEOUT_MS);
        return;
      }

      clearTimeout(timeoutId);
      setStream(stream);
      setLocalStream(stream);
      setStreamReady(true);
      console.log(
        "[Room] local stream ready, mode:",
        useSfuMode ? "SFU" : "P2P"
      );
    };

    initStream();

    return () => {
      cancelled = true;
    };
  }, [userId, roomId, useSfuMode, requestPermissions, setStream, t]);

  // === P2P: WebRTC signaling helpers ===
  const setPeer = useCallback(
    (
      remoteUserId: string,
      connection: RTCPeerConnection,
      stream: MediaStream | null
    ) => {
      const info: P2PPeerInfo = { connection, stream };
      peersRef.current.set(remoteUserId, info);
      setPeers(prev => {
        const next = new Map(prev);
        next.set(remoteUserId, info);
        return next;
      });
    },
    []
  );

  const updatePeerStream = useCallback(
    (remoteUserId: string, stream: MediaStream) => {
      const existing = peersRef.current.get(remoteUserId);
      if (existing) {
        existing.stream = stream;
        setPeers(prev => {
          const next = new Map(prev);
          const peer = next.get(remoteUserId);
          if (peer) next.set(remoteUserId, { ...peer, stream });
          return next;
        });
      }
    },
    []
  );

  const removePeer = useCallback((remoteUserId: string) => {
    const existing = peersRef.current.get(remoteUserId);
    if (existing) {
      existing.connection.close();
    }
    peersRef.current.delete(remoteUserId);
    processedUserIdsRef.current.delete(remoteUserId);
    setPeers(prev => {
      const next = new Map(prev);
      next.delete(remoteUserId);
      return next;
    });
  }, []);

  // === P2P: Tie-breaking — user with lower ID creates the offer ===
  const shouldCreateOffer = useCallback(
    (remoteUserId: string): boolean => {
      return (userId ?? "") < remoteUserId;
    },
    [userId]
  );

  const createOffer = useCallback(
    async (remoteUserId: string, stream: MediaStream) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      setPeer(remoteUserId, pc, null);

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = event => {
        if (event.candidate && channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "ICE_CANDIDATE",
            payload: { remoteUserId, candidate: event.candidate }
          });
        }
      };

      pc.ontrack = event => {
        const remoteStream = event.streams[0];
        if (remoteStream) updatePeerStream(remoteUserId, remoteStream);
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          console.log(
            `[Room] P2P connection to ${remoteUserId}: ${pc.connectionState}`
          );
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      return { offer, pc };
    },
    [setPeer, updatePeerStream]
  );

  const handleOffer = useCallback(
    async (detail: {
      remoteUserId: string;
      offer: WebRtcSessionDescription;
    }) => {
      const currentStream = localStreamRef.current;
      if (!currentStream) return;

      const { remoteUserId, offer: remoteOffer } = detail;

      // Reuse existing peer connection if one already exists
      let pc = peersRef.current.get(remoteUserId)?.connection;
      if (!pc) {
        const newPc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pc = newPc;
        setPeer(remoteUserId, pc, null);

        currentStream.getTracks().forEach(track => {
          newPc.addTrack(track, currentStream);
        });

        newPc.onicecandidate = event => {
          if (event.candidate && channelRef.current) {
            channelRef.current.send({
              type: "broadcast",
              event: "ICE_CANDIDATE",
              payload: { remoteUserId, candidate: event.candidate }
            });
          }
        };

        newPc.ontrack = event => {
          const remoteStream = event.streams[0];
          if (remoteStream) updatePeerStream(remoteUserId, remoteStream);
        };

        newPc.onconnectionstatechange = () => {
          if (
            newPc.connectionState === "disconnected" ||
            newPc.connectionState === "failed"
          ) {
            console.log(
              `[Room] P2P connection to ${remoteUserId}: ${newPc.connectionState}`
            );
          }
        };
      }

      await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ANSWER",
          payload: { remoteUserId, answer: pc.localDescription }
        });
      }
    },
    [setPeer, updatePeerStream]
  );

  const handleAnswer = useCallback(
    async (detail: {
      remoteUserId: string;
      answer: WebRtcSessionDescription;
    }) => {
      const { remoteUserId, answer } = detail;
      const peer = peersRef.current.get(remoteUserId);

      if (peer) {
        await peer.connection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    },
    []
  );

  const handleIceCandidate = useCallback(
    async (detail: { remoteUserId: string; candidate: WebRtcIceCandidate }) => {
      const { remoteUserId, candidate } = detail;
      const peer = peersRef.current.get(remoteUserId);

      if (peer) {
        await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    },
    []
  );

  // === P2P: USER_JOINED handler with tie-breaking ===
  const handleUserJoined = useCallback(
    async (detail: { userId: string; role: string }) => {
      if (detail.userId === userId) return;
      if (processedUserIdsRef.current.has(detail.userId)) return;

      processedUserIdsRef.current.add(detail.userId);
      setIsWaitingForPeer(true);

      if (!shouldCreateOffer(detail.userId)) {
        console.log(
          `[Room] Skipping offer creation for ${detail.userId} (${userId} > ${detail.userId})`
        );
        return;
      }

      const currentStream = localStreamRef.current;
      if (!currentStream) return;

      try {
        const { offer } = await createOffer(detail.userId, currentStream);

        if (channelRef.current && offer) {
          channelRef.current.send({
            type: "broadcast",
            event: "OFFER",
            payload: { remoteUserId: detail.userId, offer }
          });
        }
      } catch (err) {
        console.error("[Room] Failed to create offer:", err);
      }
    },
    [userId, shouldCreateOffer, createOffer]
  );

  // === P2P: USER_LEFT handler ===
  const handleUserLeft = useCallback(
    (detail: { userId: string }) => {
      console.log("[Room] USER_LEFT:", detail.userId);
      removePeer(detail.userId);
    },
    [removePeer]
  );

  // === P2P: Channel setup ===
  useEffect(() => {
    if (useSfuMode) return;
    if (!userId || !streamReady) return;
    if (initializedP2PRef.current) return;
    initializedP2PRef.current = true;

    let channel: RealtimeChannel | null = null;
    const currentStream = localStreamRef.current;
    if (!currentStream) return;

    const client = createRealtimeClient();

    if (!client) {
      console.error("[Room] Realtime client not configured");
      return;
    }

    channel = client.channel(`room:${roomId}`);

    channel
      .on("broadcast", { event: "OFFER" }, msg =>
        handleOffer(
          msg.payload as {
            remoteUserId: string;
            offer: WebRtcSessionDescription;
          }
        )
      )
      .on("broadcast", { event: "ANSWER" }, msg =>
        handleAnswer(
          msg.payload as {
            remoteUserId: string;
            answer: WebRtcSessionDescription;
          }
        )
      )
      .on("broadcast", { event: "ICE_CANDIDATE" }, msg =>
        handleIceCandidate(
          msg.payload as {
            remoteUserId: string;
            candidate: WebRtcIceCandidate;
          }
        )
      )
      .on("broadcast", { event: "USER_JOINED" }, msg =>
        handleUserJoined(msg.payload as { userId: string; role: string })
      )
      .on("broadcast", { event: "USER_LEFT" }, msg =>
        handleUserLeft(msg.payload as { userId: string })
      )
      .subscribe(status => {
        console.log("[Room] Channel status:", status);
        if (status === "SUBSCRIBED") {
          if (!processedUserIdsRef.current.has(userId ?? "") && userId) {
            channel!.send({
              type: "broadcast",
              event: "USER_JOINED",
              payload: { userId, role: role || "guest" }
            });
          }
        }
      });

    channelRef.current = channel;

    return () => {
      if (channel) {
        client.removeChannel(channel);
      }
    };
  }, [
    userId,
    roomId,
    role,
    streamReady,
    useSfuMode,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleUserJoined,
    handleUserLeft
  ]);

  // === Cleanup all P2P connections + leave API ===
  const doLeave = useCallback(async () => {
    if (leaveCalledRef.current) return;
    leaveCalledRef.current = true;

    // Broadcast USER_LEFT in P2P mode
    if (!useSfuMode && channelRef.current) {
      try {
        channelRef.current.send({
          type: "broadcast",
          event: "USER_LEFT",
          payload: { userId }
        });
      } catch {
        // Channel may already be closed
      }
    }

    // Close all P2P connections
    for (const [, peer] of peersRef.current) {
      peer.connection.close();
    }
    peersRef.current.clear();
    setPeers(new Map());

    // SFU cleanup
    sfuCleanup?.();

    // Stop media
    stopAll();

    // Call leave API
    const at = accessTokenRef.current;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (at && apiUrl) {
      try {
        await fetch(`${apiUrl}/room/${roomId}/leave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`
          }
        });
      } catch {
        // Best effort
      }
    }
  }, [userId, stopAll, sfuCleanup, roomId, useSfuMode]);

  const handleLeave = useCallback(async () => {
    await doLeave();
    clearSession();
    router.push("/");
  }, [doLeave, clearSession, router]);

  // === beforeunload: leave API on tab close ===
  useEffect(() => {
    const handler = () => {
      for (const [, peer] of peersRef.current) {
        peer.connection.close();
      }
      const at = accessTokenRef.current;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (at && apiUrl) {
        fetch(`${apiUrl}/room/${roomId}/leave`, {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`
          }
        });
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [roomId]);

  // === Cleanup on unmount ===
  useEffect(() => {
    doLeaveRef.current = doLeave;
  }, [doLeave]);

  useEffect(() => {
    return () => {
      doLeaveRef.current();
    };
  }, []);

  // === Missing credentials screen ===
  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">{t("room.joinError")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("room.loginRequired")}
          </p>
          <button
            onClick={() => router.push(`/join/${roomId}`)}
            className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2"
          >
            {t("room.joinRoom")}
          </button>
        </div>
      </div>
    );
  }

  const displayPeers: Map<string, { stream: MediaStream | null }> = useSfuMode
    ? (sfu.peers as Map<string, { stream: MediaStream | null }>)
    : (peers as Map<string, { stream: MediaStream | null }>);
  const hasPeers = displayPeers.size > 0;
  const sfuError = sfu?.error ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <VideoGrid>
          {streamReady && localStream && (
            <ParticipantVideo
              userId={userId}
              role={role || "guest"}
              isLocal={true}
              srcObject={localStream}
              isMuted={!audioEnabled}
              name={t("room.you")}
            />
          )}

          {mediaError && !localStream && (
            <div className="text-destructive col-span-2 flex items-center justify-center">
              {mediaError}
            </div>
          )}

          {Array.from(displayPeers.entries()).map(([peerId, peer]) =>
            peer.stream ? (
              <ParticipantVideo
                key={peerId}
                userId={peerId}
                role="guest"
                srcObject={peer.stream}
                isMuted={false}
              />
            ) : null
          )}

          {!hasPeers && streamReady && (
            <div className="text-muted-foreground col-span-2 flex items-center justify-center">
              {isWaitingForPeer
                ? t("room.waitingForPeer")
                : t("room.waitingForPeer")}
            </div>
          )}

          {!useSfuMode && sfuError && (
            <div className="text-destructive col-span-2 flex items-center justify-center text-sm">
              SFU unavailable — using P2P mode
            </div>
          )}
        </VideoGrid>
      </div>

      <VideoControls
        isMuted={!audioEnabled}
        isVideoEnabled={videoEnabled}
        onToggleMute={toggleAudio}
        onToggleVideo={toggleVideo}
        onLeave={handleLeave}
      />
    </div>
  );
};

const RoomPageWithParams = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <RoomPage />
    </Suspense>
  );
};

export default RoomPageWithParams;
