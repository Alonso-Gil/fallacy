ALTER TABLE "public"."rooms" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."rooms"
  ADD CONSTRAINT "rooms_created_by_fkey"
  FOREIGN KEY ("created_by")
  REFERENCES "auth"."users"("id")
  ON DELETE RESTRICT
  ON UPDATE NO ACTION;
