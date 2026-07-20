CREATE TABLE "user_follows" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_follows_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"follows" integer NOT NULL,
	CONSTRAINT "unique_user_follows" UNIQUE("user_id","follows")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "followers" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "following" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follows_users_id_fk" FOREIGN KEY ("follows") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;