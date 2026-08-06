import { config } from "dotenv";
import * as schema from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env.local" }); // or .env

// if using local postgres db, remove the options object,`{prepare: false}` from below,
const client = postgres(process.env.POSTGRES_URL!, {
  prepare: false,
});
export const db = drizzle(client, { schema });
