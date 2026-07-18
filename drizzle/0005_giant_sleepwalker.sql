ALTER TABLE "comment_likes" RENAME COLUMN "post_id" TO "comment_id";--> statement-breakpoint
ALTER TABLE "comment_likes" DROP CONSTRAINT "unique_user_comment_like";--> statement-breakpoint
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_post_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "unique_user_comment_like" UNIQUE("user_id","comment_id");