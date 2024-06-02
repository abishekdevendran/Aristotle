import { DATABASE_URL } from '$env/static/private';
import { Pool, neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
// import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool);
// const pool = neon(DATABASE_URL);
// export const db = drizzle(pool);
export const queryDb = drizzle(pool, { schema });
