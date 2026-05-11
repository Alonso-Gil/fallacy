"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { MicCheck } from "components/room/MicCheck/MicCheck";
import useAccessToken from "hooks/useAccessToken";
import { useJoinRoom } from "services/room/room.service.hooks";
import { useRoomSessionStore } from "store/roomSession/roomSession.store";

const JoinPage = () => {
  const t = useTranslations("Lobby");
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const { getAccessToken } = useAccessToken();
  const { mutate: joinRoom, isPending } = useJoinRoom();
  const setSession = useRoomSessionStore(s => s.setSession);

  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMicReady = useCallback(() => {
    setHasMicPermission(true);
    setError(null);
  }, []);

  const handleMicDenied = useCallback(() => {
    setHasMicPermission(false);
    setError(t("room.micRequired"));
  }, [t]);

  const handleJoinRoom = useCallback(async () => {
    try {
      const tokenResult = await getAccessToken();
      if (tokenResult.status !== "ok" || !tokenResult.accessToken) {
        setError(t("room.loginRequired"));
        return;
      }

      joinRoom(
        { accessToken: tokenResult.accessToken, roomId },
        {
          onSuccess: data => {
            setSession({
              roomId,
              token: data.cloudflareToken,
              userId: data.userId,
              role: data.role,
              sfuEnabled: data.sfuEnabled
            });
            router.push(`/room/${roomId}`);
          },
          onError: err => {
            setError(err.message);
          }
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t("room.joinError"));
    }
  }, [getAccessToken, joinRoom, router, roomId, t, setSession]);

  return (
    <div className="bg-background flex h-dvh flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("room.joinRoom")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("room.joinDescription")}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <MicCheck onReady={handleMicReady} onDenied={handleMicDenied} />

          {error && (
            <div className="bg-destructive/10 text-destructive mt-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleJoinRoom}
              disabled={!hasMicPermission || isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? t("common.loading") : t("room.enterRoom")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
