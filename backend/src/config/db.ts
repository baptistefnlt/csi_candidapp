import 'dotenv/config';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.PGHOST || undefined,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    user: process.env.PGUSER || undefined,
    password: process.env.PGPASSWORD || undefined,
    database: process.env.PGDATABASE || undefined,
    ssl: process.env.DATABASE_URL && isProd ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err: Error) => {
    console.error('Unexpected idle client error', err);
    // Ne pas crasher en prod si non souhaité, mais logger est important
});

/**
 * Exécute une requête SQL typée.
 */
export const query = async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
};

/**
 * Récupère un client pour gérer des transactions manuelles.
 * N'oublier pas de `client.release()` après usage.
 */
export const getClient = async (): Promise<PoolClient> => {
    return pool.connect();
};

export default pool;
