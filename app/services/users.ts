import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getRandomUsers(limit: number) {
  return db.query.users.findMany({
    orderBy: sql`RANDOM()`,
    limit,
    columns: { password: false, bio: false },
  });
}
export async function getUserWithPostsByUsername(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: { posts: { orderBy: [desc(posts.id)] } },
  });
}
export async function getUser(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
  });
}
export async function postUser(
  firstname: string,
  lastname: string,
  username: string,
  password: string,
) {
  return db
    .insert(users)
    .values({ firstName: firstname, lastName: lastname, username, password });
}
