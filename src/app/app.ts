import express, { Express, Request, Response } from 'express';
import { userRouter } from './routes/user.routes';
import { itemRouter } from './routes/item.routes';
import { inventoryRouter } from './routes/inventory.routes';
import { orderRouter } from './routes/order.routes';

const app: Express = express();

app.use(express.json());

app.get('/healthCheck', (req: Request, res: Response):void => {
    res.status(200).json('API is Healthy');
});

app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/inventory', inventoryRouter);
app.use('/order', orderRouter);

export {
    app
};