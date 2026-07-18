ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_post_id_comments_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;