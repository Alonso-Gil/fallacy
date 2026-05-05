import Room from "components/room/Room";
import { buildPageMetadata } from "lib/site";

import type { Metadata } from "next";

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ locale: string; roomId: string }>;
}): Promise<Metadata> => {
  const { locale, roomId } = await params;
  return buildPageMetadata({
    locale,
    path: `/room/${roomId}`,
    titleKey: "home.title",
    descriptionKey: "home.description",
    absoluteTitle: true
  });
};

const RoomPage = async ({
  params
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  return <Room roomId={roomId} />;
};

export default RoomPage;
