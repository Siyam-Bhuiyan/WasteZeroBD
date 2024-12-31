// Import the dotenv package
import dotenv from 'dotenv';

// Load the environment variables from .env file
dotenv.config();

export default {
  dialect: "postgresql",
  schema: "./utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://wastedb_owner:Ge0Ia3MFnmNr@ep-spring-sun-a5ofx7e3.us-east-2.aws.neon.tech/wastedb?sslmode=require",
    connectionString: "postgresql://wastedb_owner:Ge0Ia3MFnmNr@ep-spring-sun-a5ofx7e3.us-east-2.aws.neon.tech/wastedb?sslmode=require"
  },
};
