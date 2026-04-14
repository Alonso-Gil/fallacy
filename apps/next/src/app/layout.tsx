import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import React from "react";
import { twMerge } from "tailwind-merge";

import { cn } from "lib/utils";
import Providers from "providers/Providers";

import "globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

// TODO: Add metadata
export const metadata: Metadata = {
  title: "Fallacy",
  description: "Official page for debates"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes sets `class` on <html> from localStorage after hydration; suppress known mismatch
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body
        suppressHydrationWarning
        className={twMerge(
          inter.className,
          "bg-background-contrast dark:bg-background-dark relative h-screen w-screen overflow-hidden"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
