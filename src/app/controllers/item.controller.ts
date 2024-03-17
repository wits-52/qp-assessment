import { inventoryQueries, itemQueries } from '../constant/queries';
import { APIResponse, Item } from '../constant/types';
import { pool } from '../db/connect';

async function saveItem(item: Item): Promise<APIResponse> {
    try {
        await pool.query('BEGIN');
        await pool.query(itemQueries.saveItem(item));
        const itemId = (await pool.query(itemQueries.readItemsByItemName(item.name))).rows[0].id;
        await pool.query(inventoryQueries.saveInventory({ itemId: itemId, quantity: 0}));
        await pool.query('COMMIT');
        return {
            status: 201,
            message: 'Item saved.',
            data: {
                name: item.name,
                price: item.price
            }
        };
    } catch (err: any) {
        console.error(err.message);
        await pool.query('ROLLBACK');
        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}
async function readAllItems(): Promise<APIResponse> {
    try {
        const items = await pool.query(itemQueries.readAllItems());

        return {
            status: 200,
            data: items.rows
        };
    } catch (err: any) {
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}

async function deleteItemById(id: number): Promise<APIResponse> {
    try {
        await pool.query('BEGIN');
        await pool.query(itemQueries.deleteItem(id));
        await pool.query(inventoryQueries.deleteInventoryByItemId(id));
        await pool.query('COMMIT');
        return {
            status: 200,
            message: 'item deleted!'
        }
    } catch (err: any) {
        await pool.query('ROLLBACK');
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Check logs for details.'
        };
    }
}

async function updateItemById(id: number, updatedName: string | undefined, updatedPrice: number | undefined): Promise<APIResponse> {
    try {
        await pool.query(itemQueries.updateItem(id, updatedName, updatedPrice));

        return {
            status: 200,
            message: 'Item updated!'
        };
    } catch(err: any) {
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}
export {
    saveItem,
    readAllItems,
    deleteItemById,
    updateItemById
};