import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv"

config({ path: '.env.local' });
dotenv.config();

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
