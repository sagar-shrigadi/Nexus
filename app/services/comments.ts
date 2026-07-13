import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function newComment(
  userId: number,
  postId: number,
  content: string,
) {
  return db.insert(comments).values({ content, userId, postId });
}
export async function deleteCommentById(commentId: number) {
  return db.delete(comments).where(eq(comments.id, commentId));
}
export async function editCommentById(commentId: number, content: string) {
  return db.update(comments).set({ content }).where(eq(comments.id, commentId));
}
export async function getCommentById(commentId: number) {
  return db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });
}
