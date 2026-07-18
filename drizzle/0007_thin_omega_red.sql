CREATE TABLE "posts_likes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_likes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "unique_user_post_like" UNIQUE("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts_likes" ADD CONSTRAINT "posts_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_likes" ADD CONSTRAINT "posts_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;