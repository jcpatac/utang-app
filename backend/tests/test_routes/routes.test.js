import request from 'supertest';
import app from '../../server/app';

/**
 * TODO: use separate files for respective routes
 * TODO: better not to chain data (use factories instead)
 */

let testDataX = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'jd@gmail.com',
    password: 'newpassword'
};

let testDataY = {
    first_name: 'Foo',
    last_name: 'Bar',
    email: 'fb@gmail.com',
    password: 'newpassword'
};

let token;

/**
 * TEST AUTHENTICATION
 */
describe('User Registration', () => {
    it('should register a new user', async () => {
        let res = await request(app).post('/register').send(testDataX);
        expect(res.statusCode).toEqual(201);
        expect(res.body.email).toEqual(testDataX.email);
    });
});

describe('User Registration With Existing Email', () => {
    it('should NOT register a new user', async () => {
        let res = await request(app).post('/register').send(testDataX);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Email already exists!');
    });
});

describe('User Login', () => {
    it('should login the user', async () => {
        let res = await request(app).post('/login').send({
            email: testDataX.email,
            password: testDataX.password
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('User Login With Non-Existing Email', () => {
    it('should NOT login the user', async () => {
        let res = await request(app).post('/login').send({
            email: 'non-existing@sample.com',
            password: testDataX.password
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found!');
    });
});

describe('User Login With Incorrect Password', () => {
    it('should NOT login the user', async () => {
        let res = await request(app).post('/login').send({
            email: testDataX.email,
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Incorrect Password!');
    });
});

/**
 * TEST USER ENDPOINTS
 */

describe('Fetch All Users Without Logging In', () => {
    it('should NOT fetch all users excluding the requester', async () => {
        let res = await request(app).get('/users');
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual('Could not Authenticate!');
    });
});

 describe('Fetch All Users', () => {
    it('should fetch all users excluding the requester', async () => {
        await request(app).post('/register').send(testDataY);
        let res = await request(app).post('/login').send({
            email: testDataY.email,
            password: testDataY.password
        });
        token = res.body.token;
        res = await request(app).get('/users').set('authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });
});

describe('Fetch Current Logged In User', () => {
    it('should fetch the currently logged in user', async () => {
        let res = await request(app).get('/users/me').set('authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(testDataY.email);
    });
});

/**
 * TEST NETWORK ENDPOINTS
 */
let networkId;
describe('Create a Network', () => {
    it('should create a network of users', async () => {
        let payload = {
            network_name: 'Test Network X',
            users: [1],
            transactions: []
        }
        let res = await request(app).post(
            '/networks/create'
        ).set('authorization', token).send(payload);
        networkId = res.body.id;
        expect(res.statusCode).toEqual(201);
        expect(res.body.network_name).toEqual(payload.network_name);
    });
});

describe('Create a Network With Existing Name', () => {
    it('should create a network of users', async () => {
        let payload = {
            network_name: 'Test Network X',
            users: [1],
            transactions: []
        };
        let res = await request(app).post(
            '/networks/create'
        ).set('authorization', token).send(payload);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Network Name already exists!');
    });
});

/**
 * TEST ITEM ENDPOINTS
 */
let itemId;
describe('Create an Item', () => {
    it('should create an item', async () => {
        let payload = {
            item_name: 'Test Item X',
            amount: 1500
        };
        let res = await request(app).post(
            '/items/create'
        ).set('authorization', token).send(payload);
        itemId = res.body.id;
        expect(res.statusCode).toEqual(201);
        expect(res.body.item_name).toEqual(payload.item_name);
    });
});

describe('Create an Item With Existing Name', () => {
    it('should NOT create an item', async () => {
        let payload = {
            item_name: 'Test Item X',
            amount: 1500
        };
        let res = await request(app).post(
            '/items/create'
        ).set('authorization', token).send(payload);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Item Name already exists!');
    });
});

describe('Update an Item', () => {
    it('should update an item', async () => {
        let payload = {
            amount: 2000
        };
        let uri = `/items/${itemId}/update`
        let res = await request(app).post(uri).set(
            'authorization', token
        ).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.amount).toEqual(payload.amount);
    });
});

describe('Update a Non-Existing Item', () => {
    it('should NOT update an item', async () => {
        let payload = {
            amount: 2000
        };
        let randomId = 143;
        let uri = `/items/${randomId}/update`
        let res = await request(app).post(uri).set(
            'authorization', token
        ).send(payload);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Item not found!');
    });
});

/**
 * TEST TRANSACTION ENDPOINTS
 */
let transactionId;
describe('Create a Transaction', () => {
    it('should create a transaction', async () => {
        let payload = {
            transaction_name: 'Test Transaction X',
            sender: 1,
            receiver: 2,
            network: 1
        };
        let res = await request(app).post(
            '/transactions/create'
        ).set('authorization', token).send(payload);
        transactionId = res.body.id;
        expect(res.statusCode).toEqual(201);
        expect(res.body.transaction_name).toEqual(payload.transaction_name);
    });
});
 
describe('Create a Transaction With Existing Name', () => {
    it('should NOT create a transaction', async () => {
        let payload = {
            transaction_name: 'Test Transaction X',
            sender: 1,
            receiver: 2,
            network: 1
        };
        let res = await request(app).post(
            '/transactions/create'
        ).set('authorization', token).send(payload);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Transaction Name already exists!');
    });
});
 
describe('Update a Transaction', () => {
    it('should update a transaction', async () => {
        let payload = {
            transaction_name: 'Test Transaction Y'
        };
        let uri = `/transactions/${transactionId}/update`
        let res = await request(app).post(uri).set(
            'authorization', token
        ).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.transaction_name).toEqual(payload.transaction_name);
    });
});

describe('Update a Non-Existing Transaction', () => {
    it('should NOT update a transaction', async () => {
        let payload = {
            transaction_name: 'Test Transaction Y'
        };
        let randomId = 143;
        let uri = `/transactions/${randomId}/update`
        let res = await request(app).post(uri).set(
            'authorization', token
        ).send(payload);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Transaction not found!');
    });
});

describe('Add Items to a Transaction', () => {
    it('should add items to a transaction', async () => {
        let payload = {
            items: [itemId]
        };
        let uri = `/transactions/${transactionId}/add-items`
        let res = await request(app).post(uri).set(
            'authorization', token
        ).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(transactionId);
    });
});

describe('Fetch Items in a Transaction', () => {
    it('should fetch all items in a transaction', async () => {
        let uri = `/transactions/${transactionId}/items`
        let res = await request(app).get(uri).set(
            'authorization', token
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });
});

/**
 * TEST NETWORK ENDPOINTS (CONT)
 */
describe('Add Users to a Network', () => {
    it('should add the users to a network', async() => {
        let payload = {
            users: [2]
        }
        let res = await request(app).post(
            `/networks/${networkId}/add-users`
        ).set('authorization', token).send(payload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(networkId);
    });
});

describe('Delete a Network', () => {
    it('should delete a network', async() => {
        let res = await request(app).post(
            `/networks/${networkId}/delete`
        ).set('authorization', token).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Network deleted!');
    });
});

describe('Fetch Users in a Network', () => {
    it('should fetch all users in a network', async() => {
        let res = await request(app).get(
            `/networks/${networkId}/users`
        ).set('authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.users.length).toEqual(2);
    });
});

describe('Fetch Transactions in a Network', () => {
    it('should fetch all transactions in a network', async() => {
        let res = await request(app).get(
            `/networks/${networkId}/transactions`
        ).set('authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });
});
