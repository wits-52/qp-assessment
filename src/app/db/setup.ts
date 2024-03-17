import { pool } from './connect';
import { init } from '../constant/queries';
import { QueryResult } from 'pg';

async function setup(queries: string[]):Promise<QueryResult<any>[]> {
    const promises = [];
    for (const query of queries) {
        promises.push(pool.query(query));
    }

    return await Promise.all(promises);
}

setup(init);

