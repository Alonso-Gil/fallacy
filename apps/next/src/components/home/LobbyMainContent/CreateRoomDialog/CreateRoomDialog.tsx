"use client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

import Button from "ui/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "ui/shadcnComponents/dialog";
import { Switch } from "ui/shadcnComponents/switch";
import useAccessToken from "hooks/useAccessToken";
import { cn } from "lib/utils";
import { usePostRoom } from "services/room/room.service.hooks";
import type { CreateRoomDialogProps as Props } from "./CreateRoomDialog.types";

const debatersPerSideOptions = [1, 2, 3] as const;

const CreateRoomDialog: React.FC<Props> = props => {
  const { isRoomApiReady, className } = props;
  const t = useTranslations("Lobby");
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomMotion, setRoomMotion] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomDebatersPerSide, setRoomDebatersPerSide] = useState("2");
  const [isRoomPublic, setIsRoomPublic] = useState(true);
  const { getAccessToken } = useAccessToken();
  const { mutateAsync: createRoom, isPending: isCreating } = usePostRoom();

  const resetCreateRoomForm = () => {
    setRoomTitle("");
    setRoomMotion("");
    setRoomDescription("");
    setRoomDebatersPerSide("2");
    setIsRoomPublic(true);
  };

  const handleCreateRoom = async () => {
    if (!isRoomApiReady) {
      toast.error(t("room.errors.apiNotConfigured"));
      return;
    }
    const title = roomTitle.trim();
    if (!title) {
      toast.error(t("room.errors.titleRequired"));
      return;
    }
    const motion = roomMotion.trim();
    if (!motion) {
      toast.error(t("room.errors.motionRequiredOxford"));
      return;
    }
    const parsed = Number(roomDebatersPerSide);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3) {
      toast.error(t("room.errors.debatersPerSideInvalid"));
      return;
    }
    try {
      const accessTokenResult = await getAccessToken();
      if (accessTokenResult.status === "api_not_configured") {
        toast.error(t("room.errors.apiNotConfigured"));
        return;
      }
      if (accessTokenResult.status === "unauthenticated") {
        toast.error(t("room.errors.loginRequired"));
        return;
      }
      await createRoom({
        accessToken: accessTokenResult.accessToken,
        payload: {
          title,
          motion,
          description: roomDescription.trim() ? roomDescription.trim() : null,
          maxSeatsPerSide: parsed,
          isPublic: isRoomPublic,
          format: "OXFORD" as const
        }
      });
      setIsCreateRoomDialogOpen(false);
      resetCreateRoomForm();
      toast.success(t("room.feedback.created"));
    } catch {
      toast.error(t("room.errors.createFailed"));
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsCreateRoomDialogOpen(true)}
        isDisabled={!isRoomApiReady || isCreating}
        icon={<Plus aria-hidden className="size-4" />}
        text={t("room.actions.openCreate")}
        glow
        className={className}
      />
      <Dialog
        open={isCreateRoomDialogOpen}
        onOpenChange={setIsCreateRoomDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("room.modal.title")}</DialogTitle>
            <DialogDescription>{t("room.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="create-room-title"
                >
                  {t("room.fields.title.label")}
                </label>
                <input
                  id="create-room-title"
                  value={roomTitle}
                  onChange={event => setRoomTitle(event.target.value)}
                  maxLength={200}
                  placeholder={t("room.fields.title.placeholder")}
                  className="border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
                />
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="create-room-motion"
                >
                  {t("room.fields.motion.label")}
                </label>
                <textarea
                  id="create-room-motion"
                  value={roomMotion}
                  onChange={event => setRoomMotion(event.target.value)}
                  maxLength={5000}
                  placeholder={t("room.fields.motion.placeholder")}
                  className="border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35 min-h-20 rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
                />
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="create-room-description"
                >
                  {t("room.fields.description.label")}
                </label>
                <textarea
                  id="create-room-description"
                  value={roomDescription}
                  onChange={event => setRoomDescription(event.target.value)}
                  maxLength={5000}
                  placeholder={t("room.fields.description.placeholder")}
                  className="border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35 min-h-28 rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
                />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">
                  {t("room.fields.debateSize.label")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {debatersPerSideOptions.map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRoomDebatersPerSide(String(n))}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                        roomDebatersPerSide === String(n)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-surface border-border text-foreground hover:border-primary/45"
                      )}
                    >
                      {`${n}v${n}`}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {t("room.fields.debateSize.hint")}
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                <div className="grid gap-0.5">
                  <p className="text-sm font-medium">
                    {t("room.fields.isPublic.label")}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t("room.fields.isPublic.hint")}
                  </p>
                </div>
                <Switch
                  checked={isRoomPublic}
                  onCheckedChange={checked => setIsRoomPublic(checked)}
                />
              </div>
              <div className="rounded-lg border px-3 py-2">
                <p className="text-sm font-medium">
                  {t("room.fields.visibility.label")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {isRoomPublic
                    ? t("room.fields.visibility.publicText")
                    : t("room.fields.visibility.privateText")}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setIsCreateRoomDialogOpen(false);
                resetCreateRoomForm();
              }}
              isDisabled={isCreating}
              text={t("room.actions.cancelCreate")}
              className="h-10 w-full bg-transparent text-sm sm:w-auto sm:min-w-28"
              variant="outline"
            />
            <Button
              type="button"
              onClick={handleCreateRoom}
              isLoading={isCreating}
              isDisabled={!isRoomApiReady}
              text={t("room.actions.submitCreate")}
              glow
              className="h-10 w-full text-sm sm:w-auto sm:min-w-36"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRoomDialog;
