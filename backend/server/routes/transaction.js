import { Transaction } from '../../models';
import { Router } from 'express';

let router = Router();

/* create a transaction */
router.post('/create', async (req, res, next) => {
	/**
	 * This endpoint handles the creation of a transactions
	 */

	try {
		let payload = req.body;
		let existingTransaction = await Transaction.findOne({
			where: {
				transaction_name: payload.transaction_name
			}
		});
		if (existingTransaction) {
            res.status(409).json({
                message: "Transaction Name already exists!"
            });
		} else {
			let transaction = {
				transaction_name : payload.transaction_name,
                amount: payload.amount,
                sender_id: payload.sender,
                receiver_id: payload.receiver,
                network_id: payload.network,
                is_resolved: payload.resolved
            };
			let newTransaction = await Transaction.create(transaction);
			res.status(201).json(newTransaction);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

/* create a transaction */
router.post('/:transaction_id/update', async (req, res, next) => {
	/**
	 * This endpoint handles the creation of a transactions
	 */

	try {
		let payload = req.body;
		let transaction = await Transaction.findOne({
			where: {
				id: req.params.transaction_id
			}
		});
		if (false) {
            res.status(409).json({
                message: "Transaction Name already exists!"
            });
		} else {
			let updateFields = {
				// transaction_name : payload.transaction_name,
                amount: payload.amount,
                sender_id: payload.sender,
                receiver_id: payload.receiver,
                network_id: payload.network,
                is_resolved: payload.resolved
            };
			transaction.update(updateFields);
			res.status(200).json(transaction);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

export default router;
