import Image from "next/image";
import React from "react";

import type { GoogleIconProps } from "./GoogleIcon.types";

const GoogleIcon: React.FC<GoogleIconProps> = props => {
  const { className = "h-6 w-6" } = props;

  return (
    <Image
      src="/assets/images/google.svg"
      alt=""
      className={className}
      width={24}
      height={24}
      unoptimized
      suppressHydrationWarning
    />
  );
};

export default GoogleIcon;
