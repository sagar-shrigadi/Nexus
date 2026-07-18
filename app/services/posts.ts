import { db } from "@/db/index";
import { comments, postLikes, posts } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getAllPosts() {
  return db.query.posts.findMany({
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
    },
    extras: {
      commentCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${comments} 
        WHERE ${comments}.post_id = ${posts.id}
      )`
        .mapWith(Number)
        .as("comment_count"),
    },
  });
}
export async function getLatestPosts() {
  return db.query.posts.findMany({
    orderBy: [desc(posts.id)],
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
    },
    extras: {
      commentCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${comments} 
        WHERE ${comments}.post_id = ${posts.id}
      )`
        .mapWith(Number)
        .as("comment_count"),
    },
  });
}
export async function getPostById(id: number) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
    },
  });
}

export async function getPostByIdWithComments(id: number) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
      comments: {
        with: {
          users: {
            columns: { firstName: true, lastName: true, username: true },
          },
        },
      },
    },
    extras: {
      commentCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${comments} 
        WHERE ${comments}.post_id = ${posts.id}
      )`
        .mapWith(Number)
        .as("comment_count"),
    },
  });
}
export async function newPost(userId: number, title: string, content: string) {
  return db.insert(posts).values({ title, content, userId });
}
export async function deletePostById(postId: number) {
  return db.delete(posts).where(eq(posts.id, postId));
}
export async function editPostById(
  postId: number,
  title: string,
  content: string,
) {
  return db.update(posts).set({ title, content }).where(eq(posts.id, postId));
}
export async function likePostTransaction(userId: number, postId: number) {
  return db.transaction(async (tx) => {
    const existingLike = await tx.query.postLikes.findFirst({
      where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
    });

    if (existingLike) {
      // already liked, hence unlike now
      await tx
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} - 1` })
        .where(eq(posts.id, postId));
    } else {
      // not liked, hence like now
      await tx.insert(postLikes).values({ userId, postId });
      await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + 1` })
        .where(eq(posts.id, postId));
    }
  });
}
export async function getAllLikedPostsByUser(userId: number) {
  return db.query.postLikes.findMany({
    where: eq(postLikes.userId, userId),
  });
}
