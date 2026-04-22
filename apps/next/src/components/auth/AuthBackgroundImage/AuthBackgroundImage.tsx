"use client";
import Image from "next/image";
import React, { useState } from "react";

import { cn } from "lib/utils";
import type { AuthBackgroundImageProps } from "./AuthBackgroundImage.types";

const AuthBackgroundImage: React.FC<AuthBackgroundImageProps> = props => {
  const { src, className } = props;
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-900 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 60vw, 50vw"
        onLoad={() => setLoaded(true)}
        className="scale-105 object-cover object-center opacity-25"
      />
    </div>
  );
};

export default AuthBackgroundImage;
