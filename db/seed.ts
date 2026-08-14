import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import {
  users,
  posts,
  comments,
  postLikes,
  commentLikes,
  userFollows,
  avatars,
} from "@/db/schema";
import bcrypt from "bcryptjs";

const NUM_USERS = 20;
const MAX_POSTS_PER_USER = 5;
const MAX_COMMENTS_PER_POST = 8;
const MAX_FOLLOWS_PER_USER = 8;

// how "engaged" the fake user base is
const POST_LIKE_CHANCE = 0.4; // chance a given user likes a given post
const COMMENT_LIKE_CHANCE = 0.3;

async function seedUserAvatars() {
  const rows = [];

  while (rows.length < NUM_USERS / 2) {
    rows.push({
      fileName: `${faker.string.uuid()}.jpg`,
      publicUrl: faker.image.avatarGitHub(),
    });
  }
  return db.insert(avatars).values(rows).returning({ id: avatars.id });
}

type SeedUsersPreview = Omit<
  typeof users.$inferSelect,
  "id" | "followers" | "following"
>[];
type SeededAvatars = Pick<typeof avatars.$inferSelect, "id">;

async function seedUsers(seededAvatars: SeededAvatars[]) {
  const usernamesSeen = new Set<string>();
  const guestUserPass = await bcrypt.hash(process.env.GUEST_PASSWORD!, 10);
  const rows: SeedUsersPreview = [
    {
      firstName: "Guest",
      lastName: "User",
      username: process.env.GUEST_USERNAME!,
      password: guestUserPass,
      bio: "Default Bio",
      avatarId: null,
    },
  ];

  let avatarIndex = 0;
  while (rows.length < NUM_USERS) {
    const username = faker.internet.username();
    if (usernamesSeen.has(username)) continue; // avoid unique constraint collision
    usernamesSeen.add(username);

    const password = await bcrypt.hash(
      faker.string.alpha({ length: { min: 8, max: 12 } }),
      10,
    );

    rows.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username,
      password,
      bio: faker.person.bio(),
      avatarId: rows.length % 2 === 0 ? seededAvatars[avatarIndex++].id : null,
    });
  }

  return db.insert(users).values(rows).returning();
}

async function seedPosts(seededUsers: (typeof users.$inferSelect)[]) {
  const rows = [];

  for (const user of seededUsers) {
    const numPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });
    for (let i = 0; i < numPosts; i++) {
      rows.push({
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        content: faker.lorem.paragraphs({ min: 1, max: 3 }, "\n\n"),
        userId: user.id,
        createdAt: faker.date.past(),
      });
    }
  }

  return db.insert(posts).values(rows).returning();
}

async function seedComments(
  seededUsers: (typeof users.$inferSelect)[],
  seededPosts: (typeof posts.$inferSelect)[],
) {
  const rows = [];

  for (const post of seededPosts) {
    const numComments = faker.number.int({
      min: 0,
      max: MAX_COMMENTS_PER_POST,
    });
    for (let i = 0; i < numComments; i++) {
      const commenter = faker.helpers.arrayElement(seededUsers);
      rows.push({
        content: faker.lorem.sentence({ min: 3, max: 20 }),
        userId: commenter.id,
        postId: post.id,
        createdAt: faker.date.between({
          from: post.createdAt,
          to: new Date(),
        }),
      });
    }
  }

  if (rows.length === 0) return [];
  return db.insert(comments).values(rows).returning();
}

async function seedPostLikes(
  seededUsers: (typeof users.$inferSelect)[],
  seededPosts: (typeof posts.$inferSelect)[],
) {
  const seen = new Set<string>(); // `${userId}-${postId}`
  const rows = [];
  const likeCounts = new Map<number, number>(); // postId -> count

  for (const post of seededPosts) {
    for (const user of seededUsers) {
      if (Math.random() > POST_LIKE_CHANCE) continue;

      const key = `${user.id}-${post.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      rows.push({
        userId: user.id,
        postId: post.id,
        createdAt: faker.date.between({ from: post.createdAt, to: new Date() }),
      });
      likeCounts.set(post.id, (likeCounts.get(post.id) ?? 0) + 1);
    }
  }

  if (rows.length > 0) {
    await db.insert(postLikes).values(rows);
  }

  // sync denormalized likes count on posts
  for (const [postId, count] of likeCounts) {
    await db.update(posts).set({ likes: count }).where(eq(posts.id, postId));
  }
}

async function seedCommentLikes(
  seededUsers: (typeof users.$inferSelect)[],
  seededComments: (typeof comments.$inferSelect)[],
) {
  const seen = new Set<string>(); // `${userId}-${commentId}`
  const rows = [];
  const likeCounts = new Map<number, number>(); // commentId -> count

  for (const comment of seededComments) {
    for (const user of seededUsers) {
      if (Math.random() > COMMENT_LIKE_CHANCE) continue;

      const key = `${user.id}-${comment.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      rows.push({
        userId: user.id,
        commentId: comment.id,
        postId: comment.postId, // kept in sync with the comment's post
        createdAt: faker.date.between({
          from: comment.createdAt,
          to: new Date(),
        }),
      });
      likeCounts.set(comment.id, (likeCounts.get(comment.id) ?? 0) + 1);
    }
  }

  if (rows.length > 0) {
    await db.insert(commentLikes).values(rows);
  }

  for (const [commentId, count] of likeCounts) {
    await db
      .update(comments)
      .set({ likes: count })
      .where(eq(comments.id, commentId));
  }
}

async function seedUserFollows(seededUsers: (typeof users.$inferSelect)[]) {
  const seen = new Set<string>(); // `${followerId}-${followedId}`
  const rows = [];
  const followerCounts = new Map<number, number>(); // userId -> how many people follow them
  const followingCounts = new Map<number, number>(); // userId -> how many people they follow

  for (const user of seededUsers) {
    const numFollows = faker.number.int({ min: 0, max: MAX_FOLLOWS_PER_USER });
    const candidates = seededUsers.filter((u) => u.id !== user.id); // can't follow yourself
    const targets = faker.helpers.arrayElements(candidates, numFollows);

    for (const target of targets) {
      const key = `${user.id}-${target.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      rows.push({ userId: user.id, follows: target.id });
      followingCounts.set(user.id, (followingCounts.get(user.id) ?? 0) + 1);
      followerCounts.set(target.id, (followerCounts.get(target.id) ?? 0) + 1);
    }
  }

  if (rows.length > 0) {
    await db.insert(userFollows).values(rows);
  }

  for (const user of seededUsers) {
    await db
      .update(users)
      .set({
        followers: followerCounts.get(user.id) ?? 0,
        following: followingCounts.get(user.id) ?? 0,
      })
      .where(eq(users.id, user.id));
  }
}

async function seed() {
  console.log("Seeding user avatars...");
  const seededAvatars = await seedUserAvatars();

  console.log("Seeding users...");
  const seededUsers = await seedUsers(seededAvatars);

  console.log("Seeding posts...");
  const seededPosts = await seedPosts(seededUsers);

  console.log("Seeding comments...");
  const seededComments = await seedComments(seededUsers, seededPosts);

  console.log("Seeding post likes...");
  await seedPostLikes(seededUsers, seededPosts);

  console.log("Seeding comment likes...");
  await seedCommentLikes(seededUsers, seededComments);

  console.log("Seeding user follows...");
  await seedUserFollows(seededUsers);

  console.log("Done!");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
