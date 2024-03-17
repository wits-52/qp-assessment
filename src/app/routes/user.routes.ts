import express, { Request, Response } from 'express';
import { findUserByUserName, readAllUsers, saveUser } from '../controllers/user.controller';
import { APIResponse, User } from '../constant/types';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connect';
import { userQueries } from '../constant/queries';
import config from '../../config';

const userRouter = express.Router();

userRouter.post(['/admin', '/user'], async(req: Request, res: Response):Promise<void> => {
    if (!req.body.userName || !req.body.password) {
        const error: APIResponse = {
            error: 'userName and password are required',
            status: 400
        };
        res.status(error.status).json(error);
        return;
    }
    const userData: User = {
        userName: req.body.userName,
        role: req.path.slice(1),
        password: req.body.password
    };
    const result = await saveUser(userData);

    res.status(result.status).json(result);
});
userRouter.post('/login', async(req: Request, res: Response):Promise<void> => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(400).json({
            error: 'userName and password are required for login.'
        });
        return;
    }

    try {
        const data = await findUserByUserName(userName);

        if (data.status !== 200) {
            res.status(data.status).json(data);
            return;
        }

        const user = data.data;
        if (user.password !== password) {
            res.status(401).json({
                error: 'Incorrect password!'
            });
            return;
        }

        const token = jwt.sign({
            userName: user.username,
            role: user.role,
            id: user.id
        }, config.JWT_SECRET || '', {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'login success',
            data: {
                token: token
            }
        });

    } catch (err: any) {
        console.error(err.message);

        res.status(500).json({
            error: 'Internal server error. Please check logs for details.'
        });
    } 

});
// userRoutes.get('/', async(req: Request, res: Response):Promise<void> => {
//     const users: APIResponse = await readAllUsers();

//     const status = users.error ? 500 : 200;
//     res.status(status).json(users);
// });

export {
    userRouter
};