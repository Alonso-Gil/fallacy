CREATE TYPE "RoomStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'ENDED');

CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "max_seats" INTEGER NOT NULL DEFAULT 4,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "status" "RoomStatus" NOT NULL DEFAULT 'WAITING',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);
