ALTER TABLE "rooms" RENAME COLUMN "debate_format_config" TO "format_config";

ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "motion" TEXT;
