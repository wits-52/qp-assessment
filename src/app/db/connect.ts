import config from '../../config';
import { Pool } from 'pg';
const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DBNAME
});

export {
    pool
};