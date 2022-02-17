import { Item } from '../../models';
import { Router } from 'express';

let router = Router();

/* create an item */
router.post('/create', async (req, res, next) => {
	/**
	 * This endpoint handles the creation of a transactions
	 */

	try {
		let payload = req.body;
		let existingItem = await Item.findOne({
			where: {
				item_name: payload.item_name
			}
		});
		if (existingItem) {
            res.status(409).json({
                message: "Item Name already exists!"
            });
		} else {
			let item = {
				item_name : payload.item_name,
                amount: payload.amount,
                transaction_id: payload.transaction_id
            };
			let newItem = await Item.create(item);
			res.status(201).json(newItem);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

/* update an item */
router.post('/:item_id/update', async (req, res, next) => {
	/**
	 * This endpoint handles the creation of a transactions
	 */

	try {
		let payload = req.body;
		let item = await Item.findOne({
			where: {
				id: req.params.item_id
			}
		});
		if (!item) {
            res.status(404).json({
                message: "Transaction not found!"
            });
		} else {
			let updateFields = {
				item_name : payload.item_name,
                amount: payload.amount,
                transaction_id: payload.transaction_id
            };
			item.update(updateFields);
			res.status(200).json(item);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

export default router;
