import { User } from '../../models';
import { Router } from 'express';
import { Op } from 'sequelize';

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

// currently logged in user
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

export default router;
