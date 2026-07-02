import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
});

export const posts = pgTable("posts", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
export const postsRelations = relations(posts, ({ one }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
