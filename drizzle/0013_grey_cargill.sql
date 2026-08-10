CREATE TABLE "avatars" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "avatars_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"file_name" text NOT NULL,
	"publicUrl" text NOT NULL,
	CONSTRAINT "avatars_file_name_unique" UNIQUE("file_name")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar";