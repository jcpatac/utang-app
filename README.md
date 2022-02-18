**UtAp** (Utang Application)

**Overview**:

An application that easily logs a user's transaction with other users. The ultimate goal of this application is to find the most optimal way of resolving multiple transactions in a network. The whole application may also suggest all possible routes of payment.

**Use Case**
- *Person A* borrows 20 PHP from *Person B*
- *Person C* borrows 50 PHP from *Person B*
- This means that in the network of Person A, B, and C, *Person B* should receive 70 PHP in total.
- Thus, the app will suggest the possible payment routes (e.g. *A pays 20 PHP to C; then C pays 70 PHP to B*, etc.)

**Backend** (doing)
- Tech Stack
   - NodeJS
   - ExpressJS (Framework)
   - Sequelize (ORM)
- Models
   - User - A User object
   - Transaction - belongsTo User (One to Many); belongsTo Network (One to Many)
   - Network - belongsToMany User (Many to Many); hasMany Transactions (One to Many)
   - Item - belongsTo Transaction (One to Many)
- Authentication
   - JWT
- Database
   - SQLite
- The current backend is composed of endpoints capable of creating, reading, updating, and deleting objects.
- Available Enpoints:
   - **Register** - `http://localhost:9000/register`
      - Body (data in JSON)
         ```json
            {
               "first_name": "John",
               "last_name": "Doe",
               "email": "jd@gmail.com",
               "password": "newpassword"
            }
         ```
      - Returns User instance (data in JSON)
   - **Login** - `http://localhost:9000/login`
      - Body (data in JSON)
         ```json
         {
            "email": "jd@gmail.com",
            "password": "newpassword"
         }
         ```
      - Returns JWT token
   - **Fetch All Users** - `http://localhost:9000/users`
      - Returns List of Users
   - **Fetch Current Logged In User** - `http://localhost:9000/users/me`
      - Returns User instance (data in JSON)
   - **Fetch Networks of a User** - `http://localhost:9000/users/:user_id/networks`
      - Params - `user_id`
      - Returns a List of Networks
   - **Fetch Transactions of a User** - `http://localhost:9000/users/:user_id/transactions`
      - Params - `user_id`
      - Returns a List of Transactions
   - **Create Network** - `http://localhost:9000/networks/create`
      - Body (data in JSON)
         ```json
         {
            "network_name": "Test Network x",
            "users": [2, 3],
            "transactions": []
         }
         ```
      - Returns Network instance (data in JSON)
   - **Delete a Network** - `http://localhost:9000/networks/:network_pk/delete`
      - Params - `network_id`
   - **Add Users to Network** - `http://localhost:9000/networks/:network_id/add-users`
      - Params - `network_id`
      - Body (data in JSON)
         ```json
         {
            "network_name": "Test Network x",
            "users": [2, 3],
            "transactions": []
         }
         ```
      - Returns Network instance (data in JSON)
   - **Fetch Users in a Network** - `http://localhost:9000/networks/:network_id/users`
      - Params - `network_id`
      - Returns Network instance with Users key (data in JSON)
   - **Fetch Transactions in a Network** - `http://localhost:9000/networks/:network_id/transactions`
      - Params - `network_id`
      - Returns a List of Transactions
   - **Create Item** - `http://localhost:9000/items/create`
      - Body (data in JSON)
         ```json
         {
            "item_name": "Test Item x",
            "amount": 500
         }
         ```
      - Returns Item instance (data in JSON)
   - **Update Item** - `http://localhost:9000/items/:item_id/update`
      - Param - `item_id`
      - Body (data in JSON)
         ```json
         {
            "item_name": "Test Item y",
            "amount": 200
         }
         ```
      - Returns Item instance (data in JSON)
   - **Create a Transaction** - `http://localhost:9000/transactions/create`
      - Body (data in JSON)
         ```json
         {
            "transaction_name": "Test Transaction X",
            "sender": 1,
            "receiver": 2,
            "network": 1,
            "resolved": false,
            "items": [1]
         }
         ```
      - Returns Transaction instance (data in JSON)

   - **Update a Transaction** - `http://localhost:9000/transactions/:transaction_id/update`
      - Params - `transaction_id`
      - Body (data in JSON)
         ```json
         {
            "resolved": true
         }
         ```
      - Returns Transaction instance (data in JSON)
   - **Add Items in Transaction** - `http://localhost:9000/transactions/:transaction_id/add-items`
      - Params - `transaction_id`
      - Body (data in JSON)
         ```json
         {
            "items": [1, 2, 3]
         }
         ```
      - Returns Transaction instance (data in JSON)
   - **Fetch Items in Transaction** - `http://localhost:9000/transactions/:transaction_id/items`
      - Params - `transaction_id`
      - Returns a List of Items

**Frontend** (todo)
- Tech Stack
   - ReactJS

**Third Party API**
- [SendGrid](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail)
- Sends an email to the sender of the new transaction
