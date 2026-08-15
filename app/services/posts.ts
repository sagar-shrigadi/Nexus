import { db } from "@/db";
import { comments, media, postLikes, posts, userFollows } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { deleteMediaByArrayOfIds } from "@/app/services/media";
import { getAllCommentsOfPostWithMedia } from "@/app/services/comments";

export async function getAllPostsByUserAndUsersFollowedByUser(userId: number) {
  const userIdFollowedByUser = await db.query.userFollows.findMany({
    columns: { follows: true },
    where: eq(userFollows.userId, userId),
  });
  const userIdArrays = userIdFollowedByUser.map((u) => u.follows);
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
      media: {
        columns: { fileName: true, publicUrl: true },
      },
    },
    where: or(eq(posts.userId, userId), inArray(posts.userId, userIdArrays)),
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
      media: {
        columns: { fileName: true, publicUrl: true },
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
    columns: {
      id: true,
      title: true,
      content: true,
      userId: true,
      mediaId: true,
    },
    where: eq(posts.id, postId),
    with: {
      users: {
        columns: { username: true },
      },
      media: {
        columns: { fileName: true, publicUrl: true },
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
      media: {
        columns: { fileName: true, publicUrl: true },
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
          media: {
            columns: { fileName: true, publicUrl: true },
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
export async function newPost(
  userId: number,
  title: string,
  content: string,
  file: { fileName: string; publicUrl: string } | null,
) {
  if (file != null) {
    const [mediaId] = await db
      .insert(media)
      .values({ fileName: file.fileName, publicUrl: file.publicUrl })
      .returning({ id: media.id });
    return db.insert(posts).values({
      title,
      content,
      userId,
      mediaId: mediaId.id,
    });
  }
  return db.insert(posts).values({ title, content, userId });
}
export async function deletePostByIdTransaction(postId: number) {
  return db.transaction(async (tx) => {
    const allCommentsWithMediaOnPost =
      await getAllCommentsOfPostWithMedia(postId);
    if (allCommentsWithMediaOnPost != null) {
      const allCommentsWithMedia = allCommentsWithMediaOnPost.comments
        .map((c) => c.media)
        .filter((c) => c !== null);

      for (const comment of allCommentsWithMedia) {
        const { error } = await supabaseAdmin.storage
          .from("media")
          .remove([comment.fileName]);
        if (error) throw error;
      }
      await deleteMediaByArrayOfIds(allCommentsWithMedia.map((c) => c.id));
    }
    await tx.delete(posts).where(eq(posts.id, postId));
  });
}
export async function deleteMediaPostByFileNameTransaction(post: {
  id: number;
  media: { fileName: string };
}) {
  return db.transaction(async (tx) => {
    const allCommentsWithMediaOnPost = await getAllCommentsOfPostWithMedia(
      post.id,
    );
    if (allCommentsWithMediaOnPost != null) {
      const allCommentsWithMedia = allCommentsWithMediaOnPost.comments
        .map((c) => c.media)
        .filter((c) => c !== null);

      for (const comment of allCommentsWithMedia) {
        const { error } = await supabaseAdmin.storage
          .from("media")
          .remove([comment.fileName]);
        if (error) throw error;
      }
      await deleteMediaByArrayOfIds(allCommentsWithMedia.map((c) => c.id));
    }
    await tx.delete(media).where(eq(media.fileName, post.media.fileName));
  });
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
