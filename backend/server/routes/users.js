import { Op } from 'sequelize';
import { Router } from 'express';
import { User, Network, Transaction } from '../../models';

let router = Router();

/* list or search Users */
router.get('/', async (req, res, next) => {
	/**
	 * This endpoint handles the searching of users
	 * Returns users
	 */

	try {
		let users;
		let attr = ['id', 'first_name', 'last_name', 'email'];
		if (req.query.keyword != undefined && req.query.keyword != '') {
			users = await User.findAll({
				attributes: attr,
				where: {
					[Op.not]: {
						id: req.user.id
					},
					[Op.or]: {
						first_name: {
							[Op.substring]: req.query.keyword
						},
						last_name: {
							[Op.substring]: req.query.keyword
						}
					},
					is_active: true
				}
			});
		} else {
			users = await User.findAll({
				attributes: attr,
				where: {
					[Op.not]: {
						id: req.user.id
					},
					is_active: true
				}
			});
		}
		res.json(users);
	} catch (error) {
		res.status(400).json({
			error: error,
			message: "Something went wrong!"
		})
	}
});

/* currently logged in user */
router.get('/me', async (req, res, next) => {
	/**
	 * This endpoint handles fetching of current user
	 * Returns user
	 */

	let user = await User.findOne({
		attributes: ['id', 'first_name', 'last_name', 'email'],
		where: {
			id: req.user.id
		}
	});
	res.json(user);
});

/* list a user's networks */
router.get('/:user_id/networks', async (req, res, next) => {
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
                id: req.params.user_id
            },
            required: true
        }]
    });
	res.json(networks);
});

/* list a user's transactions */
router.get('/:user_id/transactions', async (req, res, next) => {
	/**
	 * This endpoint that returns the transactions of a user
	 * Returns networks
	 */

	let userId = req.params.user_id;
	let transactions = await Transaction.findAll({
        where: {
			[Op.or]: {
				sender_id: userId,
				receiver_id: userId
			}
		}
    });
	res.json(transactions);
});

export default router;
