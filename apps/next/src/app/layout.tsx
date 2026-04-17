import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import React from "react";

import { getMetadataBase } from "lib/site";
import { cn } from "lib/utils";

import "globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Fallacy",
    template: "%s | Fallacy"
  },
  description:
    "Join structured debates and argue with clarity. Fallacy is the home for serious online discussion.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  }
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
