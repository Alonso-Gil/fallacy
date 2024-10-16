import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";

import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

// TODO: Add metadata
export const metadata: Metadata = {
  title: "Fallacy",
  description: "Official page for debates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.className,
          "relative overflow-hidden bg-background-contrast dark:bg-background-dark",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
