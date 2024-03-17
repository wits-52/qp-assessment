import { inventoryQueries } from '../constant/queries';
import { APIResponse, Inventory } from '../constant/types';
import { pool } from '../db/connect';

async function saveInventory(inventory: Inventory): Promise<APIResponse> {
    try {
        await pool.query(inventoryQueries.saveInventory(inventory));

        return {
            status: 200,
            message: 'Inventory created'
        };
    } catch (err: any) {
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}
async function updateQuantityForItemId(itemId: number, quantity: number): Promise<APIResponse> {
    try {
        await pool.query(inventoryQueries.updateInventoryCountForItemId(itemId, quantity));

        return {
            status: 200,
            message: 'Inventory updated!'
        };
    } catch (err: any) {
        console.error(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}
async function readAllInventory(): Promise<APIResponse> {
    try {
        const data = await pool.query(inventoryQueries.readAll());

        return {
            status: 200,
            data: data.rows
        };
    } catch (err: any) {
        console.error(err.message);

        return {
            status: 500,
            error: 'Invernal server error. Please check logs for details.'
        };
    }
}
async function deleteInvetoryByItemId(itemId: number): Promise<APIResponse> {
    try {
        await pool.query(inventoryQueries.deleteInventoryByItemId(itemId));

        return {
            status: 200,
            message: 'inventory deleted'
        };
    } catch (err: any) {
        console.log(err.message);

        return {
            status: 500,
            error: 'Internal server error. Please check logs for details.'
        };
    }
}
export {
    saveInventory,
    updateQuantityForItemId,
    readAllInventory,
    deleteInvetoryByItemId
};