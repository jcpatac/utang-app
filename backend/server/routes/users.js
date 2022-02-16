import { User } from '../../models';
import { Router } from 'express';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

let router = Router();
dotenv.config();

/* List Users */
router.get('/users', async (req, res) => {
	let users = await User.findAll();
	res.json(users);
});

/* Search Users */
router.get('/users/search', async (req, res, next) => {
	/**
	 * This endpoint handles the searching of users
	 * Returns users
	 * TODO: exclude the pk of requester
	 */

	console.log(req.user)

	let users = await User.findAll({
		where: {
			[Op.or]: {
				first_name: {
					[Op.substring]: req.query.keyword
				},
				last_name: {
					[Op.substring]: req.query.keyword
				}
			}
		}
	});
	res.json(users);
});

/* User registration */
router.post('/register', async (req, res, next) => {
	/**
	 * This endpoint handles the registration feature
	 * Uses bcrypt as a hashing function
	 * returns a the created user object
	 */

	try {
		let payload = req.body;
		let existingUser = await User.findOne({
			where: {
				email: payload.email
			}
		});
		if (existingUser) {
            res.status(409).json({
                error: "Email already exists!"
            });
		} else {
            let salt = await bcrypt.genSalt(10);
			let user = {
				first_name : payload.first_name,
				last_name : payload.last_name,
				email : payload.email,
				password : await bcrypt.hash(payload.password, salt)
			}
			let createdUser = await User.create(user);
			res.status(201).json(createdUser);
		}
	} catch (error) {
		res.status(400).json({
			error: "Something went wrong!"
		})
	}
});

/* User login */
router.post('/login', async (req, res, next) => {
	/**
	 * This endpoint handles the login feature
	 * Uses bcrypt as a hashing function
	 * returns a jwt token
	 */

	let payload = req.body;
    let user = await User.findOne({
		where: {
			email: payload.email
		}
	});
    if (user) {
        let passwordValid = await bcrypt.compare(payload.password, user.password);
        if (passwordValid) {
            try {
				let token = jwt.sign(
					{
						"id": user.id,
						"email": user.email,
						"first_name": user.first_name
					},
					process.env.SECRET
				);
				res.status(200).json({
					token: token
				});
			} catch (error) {
				res.status(400).json({
					error: "Something went wrong!"
				});
			}
        } else {
            res.status(401).json({
				error: "Incorrect Password!"
			});
        }
    } else {
        res.status(404).json({
			error : "User not found!"
		});
    }
});

// router.get('/me', async (req, res, next) => {
// 	try {
// 		let token = req.headers['authorization'].split(" ")[1];
// 		let decoded = jwt.verify(token,process.env.SECRET);
// 		req.user = decoded;
// 		next();
// 	} catch (error) {
// 		res.status(401).json({
// 			error:"Could not Authenticate!"
// 		});
// 	}
// }, async (req, res, next) => {
// 	let user = await User.findOne({
// 		where: {
// 			id: req.user.id
// 		},
// 		attributes: {
// 			exclude: ["password"]
// 		}
// 	});
// 	if (user === null) {
// 		res.status(404).json({
// 			error: "User not found!"
// 		});
//     }
// 	res.status(200).json(user);
//  });

export default router;
