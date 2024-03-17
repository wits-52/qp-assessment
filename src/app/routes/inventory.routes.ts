import { Router, Request, Response } from 'express';
import { readAllInventory, updateQuantityForItemId } from '../controllers/inventory.controller';
import { auth } from '../middleware/auth';

const inventoryRouter = Router();

inventoryRouter.patch('/:id', auth, async(req: Request, res: Response): Promise<void> => {
    const { quantity } = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            error: 'id should be a valid number.'
        });
    }
    if ((req as any).decoded.role !== 'admin') {
        res.status(401).json({
            error: 'You dont have access to add items. Login as admin.'
        });
        return;
    }
    if (!quantity) {
        res.status(400).json({
            error: 'provide quantity value to be updated.'
        });
        return;
    }

    const result = await updateQuantityForItemId(id, quantity);

    res.status(result.status).json(result);
});

inventoryRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    const result = await readAllInventory();

    res.status(result.status).json(result);
});

export {
    inventoryRouter
};