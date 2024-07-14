import { Pool, neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
// import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
// const pool = neon(DATABASE_URL);
// export const db = drizzle(pool);
export const queryDb = drizzle(pool, { schema });
