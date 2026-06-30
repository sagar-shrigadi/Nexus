import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: integer("id").notNull().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
});
