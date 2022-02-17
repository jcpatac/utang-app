import { Router } from 'express';
import { Transaction, Item } from '../../models';

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
                sender_id: payload.sender,
                receiver_id: payload.receiver,
                network_id: payload.network,
                is_resolved: payload.resolved
            };
			let newTransaction = await Transaction.create(transaction);
            await newTransaction.addItems(payload.items)
			res.status(201).json(newTransaction);
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

/* update a transaction */
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
		if (transaction) {
            let updateFields = {
				transaction_name : payload.transaction_name,
                sender_id: payload.sender,
                receiver_id: payload.receiver,
                network_id: payload.network,
                is_resolved: payload.resolved
            };
			transaction.update(updateFields);
			res.status(200).json(transaction);
		} else {
            res.status(404).json({
                message: "Transaction not found!"
            });
		}
	} catch (error) {
		res.status(400).json({
            error: error,
			message: "Something went wrong!"
		})
	}
});

/* add items to a transaction */
router.post('/:transaction_id/add-items', async(req, res, next) => {
    /**
	 * This endpoint handles adding of items to a transaction
	 * Returns transaction
     * 
     * TODO add checking for existing items
	 */

    try {
        let payload = req.body;
        let transaction = await Transaction.findOne({
			where: {
				id: req.params.transaction_id
			}
		});
        if (transaction) {
            await transaction.addItems(payload.items);
            res.status(200).json(transaction);
        } else {
            res.status(404).json({
                message: 'Transaction not found!'
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error,
            message: 'Something went wrong!'
        });
    }
});

/* list a transaction's items */
router.get('/:transaction_id/items', async (req, res, next) => {
	/**
	 * This endpoint returns the items of a transaction
	 * Returns items
	 */

	let items = await Item.findAll({
        where: {
			transaction_id: req.params.transaction_id
		}
    });
	res.json(items);
});

export default router;
