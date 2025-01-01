import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  "postgresql://zerowbd_owner:xrPbkBjoi7D6@ep-weathered-glitter-a15z1a2w.ap-southeast-1.aws.neon.tech/zerowbd?sslmode=require"
);

export const db = drizzle(sql, { schema });
