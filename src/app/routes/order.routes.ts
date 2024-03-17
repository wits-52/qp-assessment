import { Router, Request, Response } from 'express';
import { Inventory } from '../constant/types';
import { saveOrder } from '../controllers/order.controller';
import { auth } from '../middleware/auth';

const orderRouter = Router();

orderRouter.post('/', auth, async(req: Request, res: Response):Promise<void> => {
    if ((req as any).decoded.role !== 'user') {
        res.status(401).json({
            error: 'You dont have access. Login as user.'
        });
        return;
    }
    const itemList: Inventory[] = req.body.items;
    const userId = (req as any).decoded.id;

    for (const item of itemList) {
        if (!item.itemId || !item.quantity) {
            res.status(400).json({
                error: 'itemId and quantity is required for all items.'
            });
            return;
        }
    }

    try {
        const result = await saveOrder(itemList, userId);

        res.status(result.status).json(result);
        return;
    } catch (err: any) {
        console.error(err.message);

        res.status(500).json({
            error: 'Internal server error. Please check logs for details.'
        });
    }
});

export {
    orderRouter
};