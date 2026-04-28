CREATE TYPE "DebateFormat" AS ENUM (
  'OXFORD',
  'BRITISH_PARLIAMENTARY',
  'WORLD_SCHOOLS',
  'FREE',
  'CUSTOM'
);

ALTER TABLE "rooms"
  ADD COLUMN "debate_format" "DebateFormat" NOT NULL DEFAULT 'OXFORD',
  ADD COLUMN "proposition_debaters_max" INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN "opposition_debaters_max" INTEGER NOT NULL DEFAULT 2;

ALTER TABLE "rooms"
  ADD CONSTRAINT "rooms_proposition_debaters_max_check"
  CHECK ("proposition_debaters_max" >= 1 AND "proposition_debaters_max" <= 3),
  ADD CONSTRAINT "rooms_opposition_debaters_max_check"
  CHECK ("opposition_debaters_max" >= 1 AND "opposition_debaters_max" <= 3);
