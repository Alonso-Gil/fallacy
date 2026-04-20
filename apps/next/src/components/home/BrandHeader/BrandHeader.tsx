import { MessageSquareQuote } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { cn } from "lib/utils";
import { BrandHeaderProps as Props } from "./BrandHeader.types";

const BrandHeader: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Lobby");

  return (
    <header
      className={cn(
        className,
        "bg-background flex items-center gap-3 px-4 py-6"
      )}
    >
      <div className="bg-primary/10 text-primary shadow-primary/25 ring-primary/15 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ring-1 ring-inset">
        <MessageSquareQuote className="h-6 w-6" />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-text text-xl leading-none font-semibold tracking-tight">
          Fallacy
        </span>
        <span className="text-text-secondary/80 truncate text-xs leading-tight">
          {t("brand.subtitle")}
        </span>
      </div>
    </header>
  );
};

export default BrandHeader;
