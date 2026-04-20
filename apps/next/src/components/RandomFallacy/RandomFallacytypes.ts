// RandomFallacy types and interfaces

export type RandomFallacyControlsAlign = "left" | "right";

// Component Props
export interface RandomFallacyProps {
  className?: string;
  controlsAlign?: RandomFallacyControlsAlign;
}

export type RandomFallacyItem = {
  title: string;
  description: string;
};
