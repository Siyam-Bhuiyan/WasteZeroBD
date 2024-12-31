import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Initialize the connection
const sql = neon(
  "postgresql://wastedb_owner:Ge0Ia3MFnmNr@ep-spring-sun-a5ofx7e3.us-east-2.aws.neon.tech/wastedb?sslmode=require"
);

// Initialize Drizzle with the schema
export const db = drizzle(sql, { schema, logger:true });

