import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/lib/env';

// Singleton de conexión para evitar agotar el pool durante hot-reload en desarrollo
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// En producción con Supavisor Pooler (puerto 6543) prepare DEBE ser false
const connectionString = env.DATABASE_URL;

export const client =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: env.NODE_ENV === 'production' ? 10 : 1,
  });

if (env.NODE_ENV !== 'production') {
  globalForDb.conn = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;
