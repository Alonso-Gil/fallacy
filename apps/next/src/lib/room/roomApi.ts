import type { Room } from "./room.types";

const getBaseUrl = (): string | null => {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  return u && u.length > 0 ? u.replace(/\/$/, "") : null;
};

const parseRooms = (data: unknown): Room[] => {
  if (!Array.isArray(data)) {
    return [];
  }
  return data as Room[];
};

export const isApiConfigured = (): boolean => getBaseUrl() !== null;

export const fetchLobbyRooms = async (): Promise<Room[]> => {
  const base = getBaseUrl();
  if (!base) {
    return [];
  }
  const res = await fetch(`${base}/room/lobby`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`lobby: ${res.status}`);
  }
  return parseRooms(await res.json());
};

export const createTestRoom = async (accessToken: string): Promise<Room> => {
  const base = getBaseUrl();
  if (!base) {
    throw new Error("api_not_configured");
  }
  const res = await fetch(`${base}/room`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Sala de prueba",
      description: "Creada desde el lobby de desarrollo",
      maxSeats: 4,
      isPublic: true
    })
  });
  if (!res.ok) {
    throw new Error(`create: ${res.status}`);
  }
  return (await res.json()) as Room;
};
