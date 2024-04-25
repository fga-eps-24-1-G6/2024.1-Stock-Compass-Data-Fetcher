import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import { getDbUrl } from './config';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: getDbUrl()!
  },
} satisfies Config;