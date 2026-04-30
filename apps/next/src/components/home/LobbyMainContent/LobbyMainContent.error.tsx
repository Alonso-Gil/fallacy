import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import Button from "ui/Button/Button";

interface LobbyMainContentErrorProps {
  isRetryingRooms: boolean;
  onRetry: () => void;
}

const LobbyMainContentError: React.FC<LobbyMainContentErrorProps> = props => {
  const { isRetryingRooms, onRetry } = props;
  const t = useTranslations("Lobby");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-384 items-center justify-center">
      <div className="border-destructive/30 from-card/80 via-background/70 to-card/60 shadow-destructive/10 relative isolate flex w-full max-w-2xl flex-col items-center gap-5 overflow-hidden rounded-3xl border bg-linear-to-br px-7 py-12 text-center shadow-2xl backdrop-blur-xl sm:px-10">
        <div
          className="bg-destructive/10 absolute -top-24 left-1/2 -z-10 size-56 -translate-x-1/2 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="bg-primary/10 absolute -right-20 -bottom-24 -z-10 size-52 rounded-full blur-3xl"
          aria-hidden
        />
        <span className="border-destructive/20 bg-destructive/10 text-destructive rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
          {t("room.feedback.errorEyebrow")}
        </span>
        <div className="relative">
          <span
            className="bg-destructive/20 absolute inset-0 rounded-full blur-xl"
            aria-hidden
          />
          <span className="border-destructive/20 bg-destructive/10 text-destructive relative flex size-16 items-center justify-center rounded-full border shadow-sm">
            <AlertTriangle className="size-8" aria-hidden />
          </span>
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            {t("room.feedback.errorTitle")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            {t("room.feedback.errorDescription")}
          </p>
        </div>
        <Button
          type="button"
          glow
          isLoading={isRetryingRooms}
          onClick={onRetry}
          text={
            isRetryingRooms
              ? t("room.actions.retryLoading")
              : t("room.actions.retryLoad")
          }
          className="h-11 w-full rounded-xl text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-36"
        />
      </div>
    </div>
  );
};

export default LobbyMainContentError;
