import { Inventory, Item, Order, OrderItem, User } from './types';

const init: string[] = [
    `CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        userName varchar(30) UNIQUE NOT NULL,
        password varchar(30) NOT NULL,
        role varchar(30) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS Items (
        id SERIAL PRIMARY KEY,
        name varchar(30) UNIQUE NOT NULL,
        price Int NOT NULL,
        addedByUser varchar(30)
    );`,
    `CREATE TABLE IF NOT EXISTS Inventory (
        id SERIAL PRIMARY KEY,
        itemId Int,
        quantity Int
    );`,
    `CREATE TABLE IF NOT EXISTS Orders (
        id SERIAL PRIMARY KEY,
        userId INT NOT NULL,
        transactionId VARCHAR(36) NOT NULL,
        fulfilled INT
    );`,
    `CREATE TABLE IF NOT EXISTS OrderItems (
        orderId INT NOT NULL,
        itemId INT NOT NULL,
        quantity INT NOT NULL
    );`

];
const userQueries = {
    saveUser: (user: User):string => {
        return `INSERT INTO Users (userName, role, password) Values ('${user.userName}', '${user.role}', '${user.password}');`;
    },
    readUser: (id: number): string => {
        return `SELECT id, userName, role FROM Users WHERE id = ${id};`;
    },
    readAllUsers: ():string => {
        return `SELECT id, userName, role FROM Users;`;
    },
    findUserByUserName: (userName: string):string => {
        return `SELECT id, userName, role, password FROM Users WHERE userName = '${userName}';`;
    },
    findUserByUserNamePassword: (userName: string, password: string):string => {
        return `SELECT id, userName, role FROM Users WHERE userName = '${userName}' and password = '${password}';`;
    }
};
const itemQueries = {
    saveItem: (item: Item):string => {
        return `INSERT INTO Items (name, price, addedByUser) Values ('${item.name}', ${item.price}, '${item.addedByUser}');`;
    },
    readItemsByUserName: (userName: string): string => {
        return `SELECT * FROM Items WHERE addedByUser = '${userName}';`;
    },
    readItemsByItemName: (name: string): string => {
        return `SELECT * FROM Items WHERE name = '${name}';`;
    },
    readAllItems: (): string => {
        return 'SELECT * FROM Items';
    },
    deleteItem: (id: number): string => {
        return `DELETE FROM Items WHERE id = ${id}`;
    },
    updateItem: (id: number, updateName: string | undefined, updatePrice: number | undefined): string => {
        let query = `UPDATE Items SET `;

        if (updateName) {
            query += `name = '${updateName}'`;
            if (updatePrice) query += ',';
        }
        if (updatePrice) {
            query += `price = ${updatePrice}`
        }
        query += ` WHERE id = ${id} ;`;
        return query;
    },
    searchItemByItemName: (itemName: string): string => {
        return `SELECT * FROM Items WHERE name = '${itemName}'`;
    }
};
const inventoryQueries = {
    saveInventory: (inventory: Inventory): string => {
        return `INSERT INTO Inventory (itemId, quantity) Values (${inventory.itemId}, ${inventory.quantity})`;
    },
    updateInventoryCountForItemId: (itemId: number, quantity: number): string => {
        return `UPDATE Inventory SET quantity = ${quantity} WHERE itemId = ${itemId}`;
    },
    readAll: ():string => {
        return 'SELECT * FROM Inventory';
    },
    readListOfItems: (itemIds: number[]): string => {
        return `SELECT itemId as itemId, quantity as quantity FROM Inventory WHERE itemId IN (${itemIds.join(', ')})`;
    },
    deleteInventoryByItemId: (itemId: number): string => {
        return `DELETE FROM Inventory WHERE itemId = ${itemId}`;
    }
};
const orderQueries = {
    saveOrder: (order: Order): string => {
        return `INSERT INTO Orders (userId, fulfilled, transactionId) VALUES (${order.userId}, ${order.fulfilled}, '${order.transactionId}')`;
    },
    saveOrderItem: (orderItems: OrderItem[]): string => {
        return `INSERT INTO OrderItems (orderId, itemId, quantity) VALUES ${orderItems.map(orderItem => '(' + orderItem.itemId +', ' + orderItem.itemId + ', ' + orderItem.quantity + ')').join(', ')}`;
    },
    getOrderIdFromTransactionId: (trasnsactionId: string): string => {
        return `SELECT id from Orders WHERE transactionId = '${trasnsactionId}'`;
    }
}
export {
    init,
    userQueries,
    itemQueries,
    inventoryQueries,
    orderQueries
};