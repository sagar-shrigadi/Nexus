import { db } from "@/db/index";

export async function getAllPosts() {
  return db.query.posts.findMany({
    with: { users: { columns: { username: true } } },
  });
}
