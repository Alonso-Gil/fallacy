import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import React from "react";

import { cn } from "lib/utils";

import "globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fallacy",
  description: "Official page for debates"
};

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body
        suppressHydrationWarning
        className={cn(
          inter.className,
          "relative h-screen w-screen overflow-hidden"
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
