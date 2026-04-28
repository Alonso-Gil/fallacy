DO $enum$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'DebateFormat' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public."DebateFormat" AS ENUM (
      'OXFORD',
      'BRITISH_PARLIAMENTARY',
      'WORLD_SCHOOLS',
      'FREE',
      'CUSTOM'
    );
  END IF;
END
$enum$;

DO $col$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rooms'
      AND column_name = 'debate_format'
  ) THEN
    ALTER TABLE public.rooms
      ADD COLUMN "debate_format" public."DebateFormat" NOT NULL DEFAULT 'OXFORD';
  END IF;
END
$col$;
