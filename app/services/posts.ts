import { db } from "@/db";
import { comments, postLikes, posts, userFollows } from "@/db/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";

export async function getAllPostsByUserAndUsersFollowedByUser(userId: number) {
  return db.query.posts.findMany({
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
    where: or(
      eq(posts.userId, userId),
      sql`${posts.userId} in (SELECT ${userFollows}.follows FROM ${userFollows} WHERE ${userFollows.userId} = ${userId})`,
    ),
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
  });
}
export async function getLatestPosts() {
  return db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    with: {
      users: {
        columns: {
          firstName: true,
          lastName: true,
          username: true,
        },
        with: {
          avatar: {
            columns: {
              publicUrl: true,
            },
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
  });
}
export async function getPostById(postId: number) {
  return db.query.posts.findFirst({
    columns: { id: true, title: true, content: true, userId: true },
    where: eq(posts.id, postId),
    with: {
      users: {
        columns: { username: true },
      },
    },
  });
}

export async function getPostByIdWithComments(id: number) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      users: {
        columns: {
          firstName: true,
          lastName: true,
          username: true,
        },
        with: {
          avatar: {
            columns: { publicUrl: true },
          },
        },
      },
      comments: {
        with: {
          users: {
            columns: {
              firstName: true,
              lastName: true,
              username: true,
            },
            with: {
              avatar: {
                columns: { publicUrl: true },
              },
            },
          },
        },
        orderBy: [desc(comments.createdAt)],
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
    columns: { postId: true },
  });
}
export async function isPostLikedByUser(userId: number, postId: number) {
  return db.query.postLikes.findFirst({
    where: and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)),
  });
}
