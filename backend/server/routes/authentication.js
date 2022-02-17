import { User } from '../../models';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

let router = Router();
dotenv.config();

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
                message: "Email already exists!"
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
            error: error,
			message: "Something went wrong!"
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
                    error: error,
					message: "Something went wrong!"
				});
			}
        } else {
            res.status(401).json({
                error: error,
				message: "Incorrect Password!"
			});
        }
    } else {
        res.status(404).json({
			message : "User not found!"
		});
    }
});

export default router;
