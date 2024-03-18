import { randomUUID } from 'crypto';
import { inventoryQueries, orderQueries } from '../constant/queries';
import { APIResponse, Inventory, Order, OrderItem } from '../constant/types';
import { pool } from '../db/connect';

async function saveOrder(list: Inventory[], userId: number): Promise<APIResponse> {
    try {
        const amountRequired:Map<number, number> = new Map();
        list.forEach(item => {
            amountRequired.set(item.itemId, item.quantity);
        })
        const inventoryList: Inventory[] = (await pool.query(inventoryQueries.readListOfItems(list.map(item => item.itemId)))).rows.map(item => {
            return {
                itemId: item.itemid,
                quantity: item.quantity
            }
        });
        if (inventoryList.length !== list.length) {
            return {
                status: 400,
                error: 'item list has some items which are invalid.'
            };
        }
        const notFulfilled = inventoryList.find(item => item.quantity < (amountRequired.get(item.itemId) || 0));

        const transactionId = randomUUID();
        const order: Order = {
            userId,
            fulfilled: notFulfilled ? 0 : 1,
            transactionId: transactionId
        };

        await pool.query('BEGIN');
        await pool.query(orderQueries.saveOrder(order));
        const orderId = (await pool.query(orderQueries.getOrderIdFromTransactionId(transactionId))).rows[0].id;

        const orderItems: OrderItem[] = [];

        list.forEach(item => {
            orderItems.push({
                orderId: orderId,
                quantity: item.quantity,
                itemId: item.itemId
            });
        });

        await pool.query(orderQueries.saveOrderItem(orderItems));
        if (order.fulfilled) {
            for (const item of inventoryList) {
                await pool.query(inventoryQueries.updateInventoryCountForItemId(item.itemId, item.quantity - (amountRequired.get(item.itemId) || 0)));
            }
        }
        await pool.query('COMMIT');

        return {
            status: 201,
            message: 'Order submitted',
            data: {
                orderId: orderId,
                orderItems,
                fulfilled: order.fulfilled
            }
        };

    } catch (err: any) {
        await pool.query('ROLLBACK');
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}

export {
    saveOrder
};