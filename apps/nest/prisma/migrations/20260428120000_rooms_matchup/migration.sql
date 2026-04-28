ALTER TABLE "rooms" ADD COLUMN "matchup" TEXT NOT NULL DEFAULT '2v2';
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "proposition_debaters_max";
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "opposition_debaters_max";
