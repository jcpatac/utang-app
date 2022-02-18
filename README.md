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
- The current backend is composed of simple endpoints capable of creating, reading, updating, and deleting objects.

**Frontend** (todo)
- Tech Stack
   - ReactJS
