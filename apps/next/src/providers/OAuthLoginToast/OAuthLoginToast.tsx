"use client";
import { usePathname, useRouter } from "i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";

const OAuthLoginToastInner: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Auth.form");
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    if (searchParams.get("signedIn") !== "1") return;
    handledRef.current = true;
    toast.success(t("loginSuccess"), { duration: 4_000 });
    const next = new URLSearchParams(searchParams.toString());
    next.delete("signedIn");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams, t]);

  return null;
};

const OAuthLoginToast: React.FC = () => (
  <Suspense fallback={null}>
    <OAuthLoginToastInner />
  </Suspense>
);

export default OAuthLoginToast;
