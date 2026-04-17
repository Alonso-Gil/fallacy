import { Playfair_Display } from "next/font/google";
import { getTranslations } from "next-intl/server";

import { cn } from "lib/utils";
import { RandomFallacyProps as Props } from "./RandomFallacytypes";

const fallacyTitle = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"]
});

const RandomFallacy = async ({ className }: Props) => {
  const t = await getTranslations("RandomFallacy");

  return (
    <article className={cn(className, "2x1:p-0 p-12 md:max-w-screen-md")}>
      <h2
        className={cn(
          fallacyTitle.className,
          "text-foreground pb-4 text-3xl font-semibold md:text-4xl"
        )}
      >
        {t("title")}
      </h2>
      <p className="text-text-secondary">{t("description")}</p>
    </article>
  );
};

export default RandomFallacy;
