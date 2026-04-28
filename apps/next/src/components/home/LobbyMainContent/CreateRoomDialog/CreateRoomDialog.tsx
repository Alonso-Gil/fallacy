"use client";
import type { DebateFormat } from "@fallacy/types";
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
const formatOptions = [
  "OXFORD",
  "FREE"
] as const satisfies ReadonlyArray<DebateFormat>;

const TITLE_MAX_LENGTH = 120;
const MOTION_MAX_LENGTH = 240;
const DESCRIPTION_MAX_LENGTH = 500;

const inputBaseClasses =
  "border-border bg-surface text-foreground placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:ring-primary/35 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3";

const inputErrorClasses =
  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30";

const submitDisabledClasses =
  "disabled:bg-primary/30 disabled:hover:bg-primary/30 disabled:text-primary-foreground/60 disabled:shadow-none disabled:cursor-not-allowed disabled:pointer-events-auto disabled:opacity-100";

const isMotionRequiredFor = (format: DebateFormat): boolean =>
  format === "OXFORD";

const CreateRoomDialog: React.FC<Props> = props => {
  const { isRoomApiReady, className } = props;
  const t = useTranslations("Lobby");
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomMotion, setRoomMotion] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomDebatersPerSide, setRoomDebatersPerSide] = useState("2");
  const [roomFormat, setRoomFormat] = useState<DebateFormat>("OXFORD");
  const [isRoomPublic, setIsRoomPublic] = useState(true);
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [isMotionTouched, setIsMotionTouched] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const { getAccessToken } = useAccessToken();
  const { mutateAsync: createRoom, isPending: isCreating } = usePostRoom();

  const trimmedTitle = roomTitle.trim();
  const trimmedMotion = roomMotion.trim();

  const isMotionRequired = isMotionRequiredFor(roomFormat);
  const isTitleInvalid = trimmedTitle.length === 0;
  const isMotionInvalid = isMotionRequired && trimmedMotion.length === 0;
  const isFormValid = !isTitleInvalid && !isMotionInvalid;
  const isTitleErrorVisible =
    isTitleInvalid && (isTitleTouched || isSubmitAttempted);
  const isMotionErrorVisible =
    isMotionInvalid && (isMotionTouched || isSubmitAttempted);

  const motionLabel = t(`room.fields.motion.labelByFormat.${roomFormat}`);
  const previewTitle =
    trimmedTitle || t("room.fields.preview.titlePlaceholder");
  const previewMotion =
    trimmedMotion || t("room.fields.preview.motionPlaceholder");
  const previewVisibility = isRoomPublic
    ? t("room.badges.public")
    : t("room.badges.private");
  const previewSeats = t("room.seatsLabel", { n: roomDebatersPerSide });
  const previewFormat = t(`room.format.${roomFormat}`);
  const previewMeta = `${previewVisibility} · ${previewFormat} · ${previewSeats}`;

  const resetCreateRoomForm = () => {
    setRoomTitle("");
    setRoomMotion("");
    setRoomDescription("");
    setRoomDebatersPerSide("2");
    setRoomFormat("OXFORD");
    setIsRoomPublic(true);
    setIsTitleTouched(false);
    setIsMotionTouched(false);
    setIsSubmitAttempted(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setIsCreateRoomDialogOpen(nextOpen);
    if (!nextOpen) {
      setIsTitleTouched(false);
      setIsMotionTouched(false);
      setIsSubmitAttempted(false);
    }
  };

  const handleCreateRoom = async () => {
    setIsSubmitAttempted(true);
    if (!isRoomApiReady) {
      toast.error(t("room.errors.apiNotConfigured"));
      return;
    }
    if (!isFormValid) {
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
      const trimmedDescription = roomDescription.trim();
      await createRoom({
        accessToken: accessTokenResult.accessToken,
        payload: {
          title: trimmedTitle,
          motion: trimmedMotion || null,
          description: trimmedDescription || null,
          maxSeatsPerSide: parsed,
          isPublic: isRoomPublic,
          format: roomFormat
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
      <Dialog open={isCreateRoomDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("room.modal.title")}</DialogTitle>
            <DialogDescription>{t("room.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="create-room-title"
                  >
                    {t("room.fields.title.label")}
                  </label>
                  <span className="text-muted-foreground text-[11px] tabular-nums">
                    {`${roomTitle.length}/${TITLE_MAX_LENGTH}`}
                  </span>
                </div>
                <input
                  id="create-room-title"
                  value={roomTitle}
                  onChange={event => setRoomTitle(event.target.value)}
                  onBlur={() => setIsTitleTouched(true)}
                  maxLength={TITLE_MAX_LENGTH}
                  aria-invalid={isTitleErrorVisible}
                  placeholder={t("room.fields.title.placeholder")}
                  className={cn(
                    inputBaseClasses,
                    "h-10",
                    isTitleErrorVisible && inputErrorClasses
                  )}
                />
                {isTitleErrorVisible ? (
                  <p className="text-destructive text-xs">
                    {t("room.fields.title.error")}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="create-room-motion"
                  >
                    {motionLabel}
                  </label>
                  <span className="text-muted-foreground text-[11px] tabular-nums">
                    {`${roomMotion.length}/${MOTION_MAX_LENGTH}`}
                  </span>
                </div>
                <textarea
                  id="create-room-motion"
                  value={roomMotion}
                  onChange={event => setRoomMotion(event.target.value)}
                  onBlur={() => setIsMotionTouched(true)}
                  maxLength={MOTION_MAX_LENGTH}
                  aria-invalid={isMotionErrorVisible}
                  placeholder={t("room.fields.motion.placeholder")}
                  className={cn(
                    inputBaseClasses,
                    "min-h-20 py-2",
                    isMotionErrorVisible && inputErrorClasses
                  )}
                />
                {isMotionErrorVisible ? (
                  <p className="text-destructive text-xs">
                    {t("room.fields.motion.error")}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="create-room-description"
                  >
                    {t("room.fields.description.label")}
                  </label>
                  <span className="text-muted-foreground text-[11px] tabular-nums">
                    {`${roomDescription.length}/${DESCRIPTION_MAX_LENGTH}`}
                  </span>
                </div>
                <textarea
                  id="create-room-description"
                  value={roomDescription}
                  onChange={event => setRoomDescription(event.target.value)}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  placeholder={t("room.fields.description.placeholder")}
                  className={cn(inputBaseClasses, "min-h-24 py-2")}
                />
              </div>
            </div>
            <div className="grid auto-rows-min gap-3">
              <div className="grid gap-2">
                <p className="text-sm font-medium">
                  {t("room.fields.format.label")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {formatOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRoomFormat(option)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                        roomFormat === option
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-surface border-border text-foreground hover:border-primary/45"
                      )}
                    >
                      {t(`room.format.${option}`)}
                    </button>
                  ))}
                </div>
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
              <div className="bg-muted/30 grid gap-2 rounded-lg border px-3 py-3">
                <p className="text-sm font-medium">
                  {t("room.fields.privacy.label")}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-foreground text-sm">
                    {t("room.fields.privacy.publicToggle")}
                  </p>
                  <Switch
                    checked={isRoomPublic}
                    onCheckedChange={checked => setIsRoomPublic(checked)}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {isRoomPublic
                    ? t("room.fields.privacy.publicHint")
                    : t("room.fields.privacy.privateHint")}
                </p>
              </div>
              <div className="bg-muted/30 grid gap-1.5 rounded-lg border px-3 py-3">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                  {t("room.fields.preview.label")}
                </p>
                <p
                  className={cn(
                    "line-clamp-2 text-sm font-semibold",
                    trimmedTitle
                      ? "text-foreground"
                      : "text-muted-foreground italic"
                  )}
                >
                  {previewTitle}
                </p>
                <p
                  className={cn(
                    "line-clamp-2 text-xs",
                    trimmedMotion
                      ? "text-foreground/80"
                      : "text-muted-foreground italic"
                  )}
                >
                  {previewMotion}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {previewMeta}
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
              isDisabled={!isRoomApiReady || !isFormValid}
              text={t("room.actions.submitCreate")}
              glow
              className={cn(
                "h-10 w-full text-sm sm:w-auto sm:min-w-36",
                submitDisabledClasses
              )}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRoomDialog;
