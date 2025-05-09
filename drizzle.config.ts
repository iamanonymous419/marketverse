import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    // url: process.env.DOCKER_DATABASE_URL!,
    url: process.env.DATABASE_URL!,
  },
});
