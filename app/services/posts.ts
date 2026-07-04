import { db } from "@/db/index";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

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
