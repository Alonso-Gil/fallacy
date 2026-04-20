"use client";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "lib/utils";

type SeparatorVariant = "solid" | "fade";

type SeparatorProps = SeparatorPrimitive.Props & {
  variant?: SeparatorVariant;
};

const variantClasses: Record<SeparatorVariant, string> = {
  solid: "bg-border",
  fade: "data-horizontal:bg-[linear-gradient(to_right,var(--background),var(--border)_20%,var(--border)_80%,var(--background))] data-vertical:bg-[linear-gradient(to_bottom,var(--background),var(--border)_20%,var(--border)_80%,var(--background))]"
};

const Separator = ({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorProps) => (
  <SeparatorPrimitive
    data-slot="separator"
    orientation={orientation}
    className={cn(
      "shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
      variantClasses[variant],
      className
    )}
    {...props}
  />
);

export { Separator };
export type { SeparatorProps, SeparatorVariant };
