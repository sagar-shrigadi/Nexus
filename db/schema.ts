import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
});

export const posts = pgTable("posts", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  likes: integer("likes").notNull().default(0),
});

export const postLikes = pgTable(
  "posts_likes",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("unique_user_post_like").on(table.userId, table.postId)],
);

export const comments = pgTable("comments", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  likes: integer("likes").notNull().default(0),
});

export const commentLikes = pgTable(
  "comment_likes",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_user_comment_like").on(table.userId, table.commentId),
  ],
);

export const userFollows = pgTable(
  "user_follows",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id") // follower
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    follows: integer("follows") // following
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [unique("unique_user_follows").on(table.userId, table.follows)],
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likedPosts: many(postLikes),
  likedComments: many(commentLikes),
  followers: many(userFollows, { relationName: "following" }),
  following: many(userFollows, { relationName: "follower" }),
}));
export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  followers: one(users, {
    fields: [userFollows.userId], // this guy is doing the following (since this guy is following others, it maps to following field in users table)
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [userFollows.follows], // this guy is being followed by the guy above (since this guy is being followed, the followers of this guy are increasing, hence it maps to followers in users table)
    references: [users.id],
    relationName: "following",
  }),
}));
export const postsRelations = relations(posts, ({ one, many }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(postLikes),
}));
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  users: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  posts: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
}));
export const commentsRelations = relations(comments, ({ one, many }) => ({
  users: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  likes: many(commentLikes),
}));
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  users: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
  posts: one(posts, {
    fields: [commentLikes.postId],
    references: [posts.id],
  }),
  comments: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}));
