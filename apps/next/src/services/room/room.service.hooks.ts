import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchLobbyRoomDetail,
  fetchLobbyRooms,
  isRoomApiConfigured,
  postRoom,
  putRoom
} from "./room.service";
import type {
  PostRoomVariables,
  PutRoomOptimisticContext,
  PutRoomVariables,
  RoomEntity,
  UseFetchLobbyRoomsParams,
  UseFetchRoomDetailParams
} from "./room.service.types";

export const roomKeys = {
  all: ["room"] as const,
  list: (scope: "lobby" | "user" = "lobby") =>
    [...roomKeys.all, "list", scope] as const,
  detail: (roomId: string) => [...roomKeys.all, "detail", roomId] as const
};

export const useFetchLobbyRooms = (params?: UseFetchLobbyRoomsParams) => {
  const isEnabled = params?.isEnabled ?? true;

  return useQuery({
    queryKey: roomKeys.list("lobby"),
    queryFn: fetchLobbyRooms,
    enabled: isEnabled && isRoomApiConfigured(),
    staleTime: 30_000
  });
};

export const useFetchRoomDetail = (params: UseFetchRoomDetailParams) => {
  const { roomId, isEnabled = true } = params;

  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => fetchLobbyRoomDetail(roomId),
    enabled: isEnabled && !!roomId && isRoomApiConfigured(),
    staleTime: 30_000
  });
};

export const usePostRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accessToken, payload }: PostRoomVariables) =>
      postRoom(accessToken, payload),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: roomKeys.list("lobby") });
    }
  });
};

export const usePutRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RoomEntity,
    Error,
    PutRoomVariables,
    PutRoomOptimisticContext
  >({
    mutationFn: ({ accessToken, roomId, payload }) =>
      putRoom(accessToken, roomId, payload),
    onMutate: async variables => {
      const { roomId, payload } = variables;
      await queryClient.cancelQueries({ queryKey: roomKeys.list("lobby") });
      await queryClient.cancelQueries({ queryKey: roomKeys.detail(roomId) });

      const previousLobbyRooms = queryClient.getQueryData<RoomEntity[]>(
        roomKeys.list("lobby")
      );
      const previousDetail = queryClient.getQueryData<RoomEntity>(
        roomKeys.detail(roomId)
      );

      queryClient.setQueryData<RoomEntity[]>(
        roomKeys.list("lobby"),
        (currentRooms: RoomEntity[] | undefined) => {
          if (!currentRooms) {
            return currentRooms;
          }
          return currentRooms.map(room =>
            room.id === roomId
              ? { ...room, ...payload, updatedAt: new Date().toISOString() }
              : room
          );
        }
      );

      queryClient.setQueryData<RoomEntity>(
        roomKeys.detail(roomId),
        (currentRoom: RoomEntity | undefined) => {
          if (!currentRoom) {
            return currentRoom;
          }
          return {
            ...currentRoom,
            ...payload,
            updatedAt: new Date().toISOString()
          };
        }
      );

      return { previousLobbyRooms, previousDetail };
    },
    onError: (_error, variables, context) => {
      if (context?.previousLobbyRooms) {
        queryClient.setQueryData(
          roomKeys.list("lobby"),
          context.previousLobbyRooms
        );
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          roomKeys.detail(variables.roomId),
          context.previousDetail
        );
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: roomKeys.list("lobby") });
      await queryClient.invalidateQueries({
        queryKey: roomKeys.detail(variables.roomId)
      });
    }
  });
};
