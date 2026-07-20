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
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  likes: integer("likes").notNull().default(0),
});

export const postLikes = pgTable(
  "posts_likes",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
  },
  (table) => [unique("unique_user_post_like").on(table.userId, table.postId)],
);

export const comments = pgTable("comments", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  likes: integer("likes").notNull().default(0),
});

export const commentLikes = pgTable(
  "comment_likes",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
  },
  (table) => [
    unique("unique_user_comment_like").on(table.userId, table.commentId),
  ],
);

export const userFollows = pgTable(
  "user_follows",
  {
    id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    follows: integer("follows")
      .notNull()
      .references(() => users.id),
  },
  (table) => [unique("unique_user_follows").on(table.userId, table.follows)],
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));
export const postsRelations = relations(posts, ({ one, many }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));
export const commentsRelations = relations(comments, ({ one }) => ({
  users: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
