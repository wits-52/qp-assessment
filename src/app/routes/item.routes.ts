import { Router, Request, Response } from 'express';
import { deleteItemById, readAllItems, saveItem, updateItemById } from '../controllers/item.controller';
import { auth } from '../middleware/auth';

const itemRouter = Router();

itemRouter.post('/', auth, async(req: Request, res: Response): Promise<void> => {
    if ((req as any).decoded.role !== 'admin') {
        res.status(401).json({
            error: 'You dont have access to add items. Login as admin.'
        });
        return;
    }
    if (!req.body.name || !req.body.price) {
        res.status(400).json({
            error: 'name and price for the item should be provided.'
        });
        return;
    }

    const result = await saveItem({
        name: req.body.name,
        price: req.body.price,
        addedByUser: (req as any).decoded.userName
    });

    res.status(result.status).json(result);
});
itemRouter.get('/', async(req:Request, res: Response): Promise<void> => {
    const result = await readAllItems();

    res.status(result.status).json(result);
});
itemRouter.delete('/:id', auth, async(req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            error: 'id must be a number.'
        });
        return;
    }
    if ((req as any).decoded.role !== 'admin') {
        res.status(401).json({
            error: 'You dont have access. Login as admin.'
        });
        return;
    }
    const result =  await deleteItemById(id);
    
    res.status(result.status).json(result);
});
itemRouter.patch('/:id', auth, async(req: Request, res: Response): Promise<void> => {
    const { name, price } = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            error: 'id must be a valid number.'
        });
        return;
    }
    if ((req as any).decoded.role !== 'admin') {
        res.status(401).json({
            error: 'You dont have access. Login as admin.'
        });
        return;
    }
    if (!name && !price) {
        res.status(500).json({
            error: 'No properties to update.'
        });
        return;
    }
    const result = await updateItemById(id, name, price);

    res.status(result.status).json(result);
});

export {
    itemRouter
};