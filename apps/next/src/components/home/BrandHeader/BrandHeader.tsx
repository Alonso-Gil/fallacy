"use client";
import { useTranslations } from "next-intl";
import React from "react";

import Logo from "ui/Logo/Logo";
import { cn } from "lib/utils";
import { BrandHeaderProps as Props } from "./BrandHeader.types";

const BrandHeader: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Lobby");

  return (
    <header
      className={cn(
        className,
        "from-background/90 border-border/25 flex items-center gap-3 border-b bg-gradient-to-b to-transparent px-4 py-5"
      )}
    >
      <Logo
        variant="compact"
        description={t("brand.subtitle")}
        className="min-w-0"
      />
    </header>
  );
};

export default BrandHeader;
