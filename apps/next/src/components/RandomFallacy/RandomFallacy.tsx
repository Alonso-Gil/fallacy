"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { RandomFallacyProps as Props } from "./RandomFallacytypes";

const fallacyTitle = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"]
});

const AUTOPLAY_INTERVAL_MS = 8000;

type FallacyItem = {
  title: string;
  description: string;
};

const RandomFallacy: React.FC<Props> = ({ className }) => {
  const t = useTranslations("RandomFallacy");
  const items = t.raw("items") as FallacyItem[];
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const handlePrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const handleNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const id = setTimeout(() => {
      setIndex(current => (current + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [index, isPaused, total]);

  const current = items[index];

  if (!current) return null;

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Fallacies"
      className={cn(
        className,
        "relative mx-auto flex w-full max-w-2xl flex-col items-stretch gap-6 px-6 md:px-12"
      )}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <article
        key={index}
        aria-roledescription="slide"
        aria-label={`${index + 1} / ${total}`}
        className="animate-fade-in flex min-h-64 w-full flex-col justify-center"
      >
        <h2
          className={cn(
            fallacyTitle.className,
            "text-foreground pb-4 text-3xl font-semibold md:text-4xl"
          )}
        >
          {current.title}
        </h2>
        <p className="text-text-secondary leading-relaxed">
          {current.description}
        </p>
      </article>

      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label={t("previous")}
            onClick={handlePrev}
            className="border-border/60 hover:bg-surface-secondary hover:border-border rounded-full"
          >
            <ChevronLeft />
          </Button>

          <div
            role="tablist"
            aria-label="Pagination"
            className="flex items-center gap-2"
          >
            {items.map((item, dotIndex) => {
              const isActive = dotIndex === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={t("goTo", { index: dotIndex + 1 })}
                  onClick={() => goTo(dotIndex)}
                  className={cn(
                    "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                    isActive
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-text-secondary/60 w-1.5"
                  )}
                />
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label={t("next")}
            onClick={handleNext}
            className="border-border/60 hover:bg-surface-secondary hover:border-border rounded-full"
          >
            <ChevronRight />
          </Button>
        </div>

        <span className="text-text-secondary/60 text-xs font-medium tracking-wider tabular-nums">
          <span className="text-text-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="px-1.5">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </span>
      </div>
    </section>
  );
};

export default RandomFallacy;
