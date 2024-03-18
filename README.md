Summary: API to manage grocery
Technology: TS, node.js, express.js, postgres, jwt, docker

1. To run the api 
    a. using docker
        `
            docker-compose up -d
        `
    b. using node (before running setup local .env file)
        `
            npm install
            npm run build
            npm start
        `

2. DB schema
    DB has following tables to store all data dealt in service.
    - Users : store user info (userName, password, role)
    - Items: store item info (name, price, addedByUser)
    - Inventory: store inventory details for each item, (itemId, quantity)
    - Order: stores orders placed (orderId, transactionId, userId, fulfilled)
    - OrderItems: stores items that were part of the order (orderId, itemId, quantity)

3. Endpoints:
    - GET /healthCheck : check api health if api is healthy to accept request, reutrn status 200 if healthy
    - POST /user/admin : register admin user: requires (userName, password) in req body as json
    - POST /user/user : register non-admin user: requires (userName, password) in req body as json
    - POST /login : login user, returns jwt token: requires (userName, password) in req body as json
    - GET /item : read all items present in DB, no auth required
    - POST /item : add new item to DB, only admin user is authorized to do so. requires bearer token in header, requires (price, name) in req body as json
    - PATCH /item/:id : update item details, only admin user is authorized to do so. requires atleast one prop from price, name to be passed in req body as json
    - DELETE /item/:id : delete item with given id, only admin user is authorized to do so. requires
    - GET /inventory : read inventory details for all items in DB.
    - PATCH /inventory/:id : update item with id in req params, only admin user is authorized to do so. requires quantity in req body as json
    - POST /order : place order with multiple item support. only non-admin user is authorized to do so. requires items array on req body as json with each item having valid itemId and quantity in req.body as json 

4. Scope of improvement
    - password encryption
    - enhanceed logging
    - unit test and api test
    - caching some data like list of items
    - pagination for endpoint which read entire data for some entity like GET /item, GET /inventory