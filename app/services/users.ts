import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function getRandomUsers() {
  return db.query.users.findMany({
    orderBy: sql`RANDOM()`,
    limit: 10,
    columns: { password: false, bio: false },
  });
}
