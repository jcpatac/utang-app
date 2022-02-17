import { Network, User } from '../../models';
import { Router } from 'express';

let router = Router();

/* list a user's networks */
router.get('/', async (req, res, next) => {
	/**
	 * This endpoint that returns the network of a user
	 * Returns networks
	 */

    let networks = await Network.findAll({
        where: {
            is_active: true
        },
        include: [{
            model: User,
            as: 'users',
            attributes: ['id'],
            where: {
                id: req.user.id
            },
            required: true
        }]
    });
	res.json(networks);
});

/* list network users */
router.get('/users', async (req, res, next) => {
	/**
	 * This endpoint that returns the network of a user
	 * Returns networks
	 */

    let payload = req.body;
    let networks = await Network.findOne({
        attributes: ['id', 'network_name'],
        where: {
            id: payload.network_id
        },
        include: [{
            model: User,
            as: 'users',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            through: {
                attributes: []
            },
            required: true
        }]
    });
	res.json(networks);
});

/* create a network */
router.post('/create', async (req, res, next) => {
	/**
	 * This endpoint handles the creation of a network
	 */

	try {
		let payload = req.body;
		let existingNetwork = await Network.findOne({
			where: {
				network_name: payload.network_name
			}
		});
		if (existingNetwork) {
            res.status(409).json({
                message: "Network Name already exists!"
            });
		} else {
			let network = {
				network_name : payload.network_name
            };
			let newNetwork = await Network.create(network);
            await newNetwork.addUsers(payload.users);
            // newNetwork.addTransactions(payload.transactions);
			res.status(201).json(newNetwork);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

/* add users to a network */
router.post('/add-users', async(req, res, next) => {
    /**
	 * This endpoint handles adding of users to a network
	 * Returns network
     * 
     * TODO add checking for existing users
	 */

    try {
        let payload = req.body;
        let network = await Network.findOne({
			where: {
				id: payload.network_id
			}
		});
        if (network) {
            await network.addUsers(payload.users);
            console.log(await network.getUsers());
            res.status(200).json(network);
        }
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Something went wrong!'
        });
    }
});

/* delete a network */
router.post('/delete', async(req, res, next) => {
    /**
	 * This endpoint handles deleting of a network
	 * Returns message
     * 
     * set is_active = false instead of deleting
     * data is valuable
	 */

    try {
        let payload = req.body;
        let network = await Network.findOne({
			where: {
				id: payload.network_id
			}
		});
        if (network) {
            await network.update({
                is_active: false
            });
            res.status(200).json({
                message: 'Network deleted!'
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Something went wrong!'
        });
    }
});

export default router;
