import { db } from "@/db";
import { media } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function deleteMediaByArrayOfIds(mediaIds: number[]) {
  return db.delete(media).where(inArray(media.id, mediaIds));
}
