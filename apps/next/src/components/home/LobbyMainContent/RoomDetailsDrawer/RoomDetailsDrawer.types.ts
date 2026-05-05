import type { RoomEntity } from "services/room/room.service.types";

export interface RoomDetailsDrawerProps {
  room: RoomEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
