export type Room = {
  id: string;
  title: string;
  description: string | null;
  maxSeats: number;
  isPublic: boolean;
  status: "WAITING" | "IN_PROGRESS" | "ENDED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
