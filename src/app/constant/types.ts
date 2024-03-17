type AppConfig = {
    PORT: string,
    DB_PORT: number,
    DB_HOST: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_DBNAME: string
    JWT_SECRET: string | undefined
};
type User = {
    userName: string,
    role: string,
    password: string
};
type Item = {
    name: string,
    price: number,
    addedByUser: string
};
type Inventory = {
    itemId: number,
    quantity: number
};
type Order = {
    userId: number,
    fulfilled: number,
    transactionId: string
};
type OrderItem = {
    itemId: number,
    orderId: number,
    quantity: number
};
type APIStatusCode = 200 | 201 | 500 | 400 | 401 | 404;
type APIResponse = {
    error?: string,
    data?: any,
    message?: string,
    status: APIStatusCode
};
export {
    AppConfig,
    User,
    Item,
    Inventory,
    Order,
    OrderItem,
    APIResponse
};