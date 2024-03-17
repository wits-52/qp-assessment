import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

function auth(req: Request, res: Response, next: NextFunction): void {
    const tokenHeader = req.headers.authorization;
    const [ type, token ] = (tokenHeader || '').split(' ');
    if (type !== 'Bearer' || !token) {
        res.status(400).json({
            error: 'Pass valid token.'
        });
        return;
    }

    try {
        const user = jwt.verify(token, config.JWT_SECRET || '');
        
        (req as any).decoded = user;
        next();
    } catch (err: any) {
        console.error(err.message);

        res.status(401).json({
            error: 'authentication failed. Try login again.'
        });
        return;
    }
}

export {
    auth
};