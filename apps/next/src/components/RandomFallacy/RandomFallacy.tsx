"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "ui/shadcnComponents/button";
import { cn } from "lib/utils";
import {
  RandomFallacyItem,
  RandomFallacyProps as Props
} from "./RandomFallacytypes";

const fallacyTitle = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"]
});

const AUTOPLAY_INTERVAL_MS = 8000;

const RandomFallacy: React.FC<Props> = ({
  className,
  controlsAlign = "right"
}) => {
  const t = useTranslations("RandomFallacy");
  const items = t.raw("items") as RandomFallacyItem[];
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
        "relative flex h-full w-full flex-col px-6 pt-12 pb-20 md:px-12"
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
        className="animate-fade-in mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center"
      >
        <h2
          className={cn(
            fallacyTitle.className,
            "pb-4 text-3xl font-semibold text-white md:text-4xl"
          )}
        >
          {current.title}
        </h2>
        <p className="text-pretty text-white/75 md:text-lg md:leading-relaxed">
          {current.description}
        </p>
      </article>

      <div
        className={cn(
          "absolute bottom-3 z-20 flex items-center gap-3",
          controlsAlign === "right" ? "right-4" : "left-4"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={t("previous")}
          onClick={handlePrev}
          className="rounded-full border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
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
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/30 hover:bg-white/60"
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
          className="rounded-full border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
        >
          <ChevronRight />
        </Button>

        <span className="ml-1 text-xs font-medium tracking-wider text-white/50 tabular-nums">
          <span className="text-white/80">
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
