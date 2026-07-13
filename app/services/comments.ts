import { db } from "@/db";
import { comments } from "@/db/schema";

export async function newComment(
  userId: number,
  postId: number,
  content: string,
) {
  return db.insert(comments).values({ content, userId, postId });
}
