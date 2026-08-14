import { db } from "@/db";
import { commentLikes, comments, media, posts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function newComment(
  userId: number,
  postId: number,
  content: string,
  file: { fileName: string; publicUrl: string } | null,
) {
  if (file != null) {
    const [mediaId] = await db
      .insert(media)
      .values({ fileName: file.fileName, publicUrl: file.publicUrl })
      .returning({ id: media.id });
    return db.insert(comments).values({
      content,
      userId,
      postId,
      mediaId: mediaId.id,
    });
  }
  return db.insert(comments).values({ content, userId, postId });
}
export async function deleteCommentById(commentId: number) {
  return db.delete(comments).where(eq(comments.id, commentId));
}
export async function deleteMediaCommentByFileName(fileName: string) {
  return db.delete(media).where(eq(media.fileName, fileName));
}
export async function editCommentById(commentId: number, content: string) {
  return db.update(comments).set({ content }).where(eq(comments.id, commentId));
}
export async function getCommentById(commentId: number) {
  return db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });
}
export async function likeCommentTransaction(
  userId: number,
  commentId: number,
  postId: number,
) {
  return db.transaction(async (tx) => {
    const existingLike = await tx.query.commentLikes.findFirst({
      where: and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId),
      ),
    });

    if (existingLike) {
      // already liked, hence unlike now
      await tx
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, userId),
          ),
        );
      await tx
        .update(comments)
        .set({ likes: sql`${comments.likes} - 1` })
        .where(eq(comments.id, commentId));
    } else {
      // not liked, hence like now
      await tx.insert(commentLikes).values({ userId, commentId, postId });
      await tx
        .update(comments)
        .set({ likes: sql`${comments.likes} + 1` })
        .where(eq(comments.id, commentId));
    }
  });
}
export async function getAllLikedCommentsByUserOnPost(
  userId: number,
  postId: number,
) {
  return db.query.commentLikes.findMany({
    where: and(
      eq(commentLikes.postId, postId),
      eq(commentLikes.userId, userId),
    ),
    columns: { commentId: true },
  });
}
export async function getAllCommentsOfPostWithMedia(postId: number) {
  return db.query.posts.findFirst({
    columns: {},
    where: and(eq(posts.id, postId)),
    with: {
      comments: {
        columns: { mediaId: true },
        with: {
          media: true,
        },
      },
    },
  });
}
