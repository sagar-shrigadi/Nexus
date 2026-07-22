import { db } from "@/db";
import { comments, posts, userFollows, users } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

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
    with: {
      posts: {
        orderBy: [desc(posts.id)],
        extras: {
          commentsCount: sql<number>`(
            SELECT COUNT(*) 
            FROM ${comments} 
            WHERE ${comments}.post_id = ${posts.id}
          )`
            .mapWith(Number)
            .as("comment_count"),
        },
      },
    },
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
export async function followUserTransaction(
  userId: number,
  userToFollow: number,
) {
  return db.transaction(async (tx) => {
    const existingFollow = await tx.query.userFollows.findFirst({
      where: and(
        eq(userFollows.userId, userId),
        eq(userFollows.follows, userToFollow),
      ),
    });

    if (existingFollow) {
      // user already follows, unfollow now

      await tx
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.userId, userId),
            eq(userFollows.follows, userToFollow),
          ),
        );
      // reduce the following users count of user who want to unfollow
      await tx
        .update(users)
        .set({ following: sql`${users.following} - 1` })
        .where(eq(users.id, userId));

      // reduce the followers users count of user whom got unfollowed
      await tx
        .update(users)
        .set({ followers: sql`${users.followers} - 1` })
        .where(eq(users.id, userToFollow));
    } else {
      // user follows now

      await tx.insert(userFollows).values({ userId, follows: userToFollow });
      // increment the following user count of user who wishes to follow
      await tx
        .update(users)
        .set({ following: sql`${users.following} + 1` })
        .where(eq(users.id, userId));

      // increment the followers user count of user who is being followed
      await tx
        .update(users)
        .set({ followers: sql`${users.followers} + 1` })
        .where(eq(users.id, userToFollow));
    }
  });
}
export async function allUsersFollowedByUser(userId: number) {
  return db.query.userFollows.findMany({
    where: eq(userFollows.userId, userId),
    columns: { follows: true },
  });
}
