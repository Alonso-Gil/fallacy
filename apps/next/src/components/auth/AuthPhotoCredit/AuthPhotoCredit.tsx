import { useTranslations } from "next-intl";
import React, { ReactNode } from "react";

import { cn } from "lib/utils";
import { AuthPhotoCreditProps as Props } from "./AuthPhotoCredit.types";

const renderLink = (href: string) => {
  const Link = (chunks: ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="underline transition-colors hover:text-white"
    >
      {chunks}
    </a>
  );
  Link.displayName = "AuthPhotoCreditLink";
  return Link;
};

const AuthPhotoCredit: React.FC<Props> = ({ background, className }) => {
  const t = useTranslations("Auth");

  return (
    <span className={cn(className, "absolute z-10 text-xs text-white/60")}>
      {t.rich("photoCredit", {
        name: background.author,
        author: renderLink(background.authorUrl),
        site: renderLink(background.photoUrl)
      })}
    </span>
  );
};

export default AuthPhotoCredit;
