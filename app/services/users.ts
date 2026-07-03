import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function getRandomUsers(limit: number) {
  return db.query.users.findMany({
    orderBy: sql`RANDOM()`,
    limit,
    columns: { password: false, bio: false },
  });
}
