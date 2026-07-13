import { db } from "@/db/index";
import { comments, posts } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getAllPosts() {
  return db.query.posts.findMany({
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
    },
  });
}
export async function getLatestPosts() {
  return db.query.posts.findMany({
    orderBy: [desc(posts.id)],
    with: {
      users: { columns: { firstName: true, lastName: true, username: true } },
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
