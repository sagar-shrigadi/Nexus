ALTER TABLE "comment_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "posts_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;