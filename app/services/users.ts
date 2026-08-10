import { db } from "@/db";
import { avatars, comments, posts, userFollows, users } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import { and, desc, eq, not, sql } from "drizzle-orm";

export async function getRandomUsersExcludingUser(userId: number) {
  return db.query.users.findMany({
    where: not(eq(users.id, userId)),
    orderBy: sql`RANDOM()`,
    limit: 10,
    columns: { password: false, bio: false },
  });
}
export async function getUserWithPostsByUsername(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      posts: {
        orderBy: [desc(posts.createdAt)],
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
      comments: {
        orderBy: [desc(comments.createdAt)],
      },
    },
  });
}
export async function getUser(username: string) {
  return db.query.users.findFirst({
    columns: {
      id: true,
      username: true,
      password: true,
      firstName: true,
      lastName: true,
    },
    with: { avatar: { columns: { publicUrl: true } } },
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
export async function allUsersFollowedByUserWithId(userId: number) {
  return db.query.userFollows.findMany({
    where: eq(userFollows.userId, userId),
    columns: { follows: true },
  });
}
export async function getMostFollowedUsersExcludingUser(userId: number) {
  return db.query.users.findMany({
    columns: { id: true, username: true, firstName: true, lastName: true },
    where: not(eq(users.id, userId)),
    orderBy: [desc(users.followers)],
    limit: 3,
  });
}
export async function isUserFollowedByUserWithId(
  userId: number,
  userToCheck: number,
) {
  return db.query.userFollows.findFirst({
    where: and(
      eq(userFollows.userId, userId),
      eq(userFollows.follows, userToCheck),
    ),
  });
}
export async function getAllPostsAndCommentsAndLikedPostsAndLikedCommentsByUser(
  username: string,
) {
  return db.query.users.findFirst({
    columns: { password: false },
    where: eq(users.username, username),
    with: {
      avatar: {
        columns: { publicUrl: true, fileName: true },
      },
      posts: {
        columns: { userId: false },
        extras: {
          commentsCount: sql<number>`(
            SELECT COUNT(*)
            FROM ${comments}
            WHERE ${comments}.post_id = ${posts.id}
          )`
            .mapWith(Number)
            .as("comment_count"),
        },
        orderBy: [desc(posts.createdAt)],
      },
      comments: {
        columns: { userId: false },
        orderBy: [desc(comments.createdAt)],
      },
      likedPosts: {
        columns: { id: true },
        with: {
          posts: {
            with: {
              users: {
                columns: {
                  username: true,
                  firstName: true,
                  lastName: true,
                },
                with: {
                  avatar: {
                    columns: { publicUrl: true },
                  },
                },
              },
            },
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
        orderBy: (likedPosts, { desc }) => [desc(likedPosts.createdAt)],
      },
      likedComments: {
        columns: { id: true },
        with: {
          comments: {
            with: {
              users: {
                columns: {
                  username: true,
                  firstName: true,
                  lastName: true,
                },
                with: {
                  avatar: {
                    columns: { publicUrl: true },
                  },
                },
              },
            },
          },
        },
        orderBy: (likedComments, { desc }) => [desc(likedComments.createdAt)],
      },
    },
  });
}
export async function getIdsOfAllLikedPostsAndLikedCommentsByUser(
  userId: number,
) {
  return db.query.users.findFirst({
    columns: { id: true },
    where: eq(users.id, userId),
    with: {
      likedComments: {
        columns: { commentId: true },
      },
      likedPosts: {
        columns: { postId: true },
      },
    },
  });
}
export async function updateAvatarTransaction(
  userId: number,
  fileName: string,
  publicUrl: string,
) {
  return db.transaction(async (tx) => {
    // get the current user avatar id
    const user = await tx.query.users.findFirst({
      columns: { avatarId: true },
      with: {
        avatar: { columns: { fileName: true } },
      },
      where: eq(users.id, userId),
    });

    if (!user) throw new Error("User does not exist!");
    if (user.avatarId) {
      // user avatar exists then
      // delete the previous avatar file supabase storage
      const { error } = await supabase.storage
        .from("avatars")
        .remove([user.avatar!.fileName]);

      if (error === null) {
        // update the avatar from avatars table
        await tx
          .update(avatars)
          .set({ fileName, publicUrl })
          .where(eq(avatars.id, user.avatarId));
      } else {
        throw error;
      }
    } else {
      // user avatar doesn't exist
      // create new record in avatars table
      const [newAvatar] = await tx
        .insert(avatars)
        .values({ fileName, publicUrl })
        .returning();

      // update the users table and with the id retrived from above
      await tx
        .update(users)
        .set({ avatarId: newAvatar.id })
        .where(eq(users.id, userId));
    }
  });
}
export async function getUserAvatar(userId: number) {
  return db.query.users.findFirst({
    columns: {},
    where: eq(users.id, userId),
    with: { avatar: { columns: { publicUrl: true } } },
  });
}
export async function deleteUserAvatar(avatarId: number) {
  return db.delete(avatars).where(eq(avatars.id, avatarId));
}
