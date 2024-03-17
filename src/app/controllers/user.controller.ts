import { userQueries } from '../constant/queries';
import { APIResponse, User } from '../constant/types';
import { pool } from '../db/connect';

async function saveUser(data: User): Promise<APIResponse> {
    try {
        const user = await pool.query(userQueries.findUserByUserName(data.userName));

        if (user.rowCount !== 0) {
            return {
                status: 400,
                error: 'User name is already in use. Please try something else.'
            };
        }
    } catch(err: any) {
        console.log(err.message);

        return {
            status: 500,
            error: 'Internal Server Error. Please check logs for details.'
        }
    }
    try {
        await pool.query(userQueries.saveUser(data));

        return {
            status: 201,
            message: 'User Created!',
            data: {
                userName: data.userName,
                role: data.role
            }
        };
    } catch (err: any) {
        console.log(err.message);

        return {
            status: 500,
            error: 'Internal Server Error. Please check logs for details.'
        }
    }
}

async function readAllUsers(): Promise<APIResponse> {
    try {
        const users = await pool.query(userQueries.readAllUsers());

        return {
            message: `Read ${users.rowCount} rows.`,
            data: users.rows,
            status: 200
        };
    } catch (err: any) {
        console.error(err.message);

        return {
            error: 'Internal server error. Check logs for details.',
            status: 500
        }
    }
}

async function findUserByUserName(userName: string): Promise<APIResponse> {
    try {
        const user = await pool.query(userQueries.findUserByUserName(userName));

        if (user.rowCount === 0) {
            return {
                status: 404,
                error: 'User not found with given username.'
            };
        } else {
            return {
                status: 200,
                data: user.rows[0]
            }
        }
    } catch (err: any) {
        console.error(err);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}

export {
    saveUser,
    readAllUsers,
    findUserByUserName
};