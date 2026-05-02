import React from "react";

const roomPlaceholderItems = Array.from({ length: 5 }, (_, index) => index);

const LobbyMainContentPlaceholder: React.FC = () => {
  return (
    <div
      className="mx-auto grid w-full max-w-384 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4"
      aria-hidden
    >
      {roomPlaceholderItems.map(item => (
        <article
          key={item}
          className="border-border/50 bg-card/70 flex min-h-[232px] w-full max-w-full min-w-0 animate-pulse flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/4"
        >
          <div className="flex flex-1 flex-col gap-2.5 p-3.5">
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-foreground/10 h-5 w-18 rounded-full" />
              <span className="bg-foreground/10 h-5 w-16 rounded-full" />
              <span className="bg-foreground/10 h-5 w-14 rounded-full" />
              <span className="bg-foreground/10 h-5 w-12 rounded-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-1.5">
                <span className="bg-foreground/10 h-4 w-4/5 rounded-full" />
              </div>
              <div className="flex h-[2.75em] flex-col gap-1.5">
                <span className="bg-foreground/10 h-3.5 w-full rounded-full" />
                <span className="bg-foreground/10 h-3.5 w-3/4 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="bg-foreground/10 h-3 w-28 rounded-full" />
              <div className="flex items-center justify-between gap-2">
                <span className="bg-foreground/10 h-3.5 w-36 rounded-full" />
                <span className="bg-foreground/10 h-3.5 w-10 rounded-full" />
              </div>
              <span className="bg-foreground/10 h-1 w-full rounded-full" />
            </div>
          </div>
          <div className="border-border/40 flex items-center justify-between border-t px-3.5 py-2.5">
            <span className="bg-foreground/10 h-3 w-20 rounded-full" />
            <span className="bg-foreground/10 h-7 w-18 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  );
};

export default LobbyMainContentPlaceholder;
