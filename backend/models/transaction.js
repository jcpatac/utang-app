'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
		/**
         * Transaction Model
         * Represents a Transaction object
         * Fields:
         *      - transaction_name  --- the name of the transaction
         * 		- amount	        --- the amount of transaction
         * 		- date		        --- the date of the transaction
         * 		- is_resolved	    --- if the transaction is resolved or not
         * 		- resolution_date	--- the date of resolution
         *      - sender_id         --- sender FK
         *      - receiver_id       --- User FK
         *      - network_id        --- Network FK
         * 
         * Associations:
         *      - sender            --- User sending the payment
         *      - receiver          --- User receiving the payment
         *      - network           --- Network that the transaction belongs
         *      - items             --- Items in a transaction
         */
		static associate(models) {
			// define association here
            Transaction.belongsTo(models.User, {
                as: 'sender',
                foreignKey: 'sender_id'
            });
            Transaction.belongsTo(models.User, {
                as: 'receiver',
                foreignKey: 'receiver_id'
            });
            Transaction.belongsTo(models.Network, {
                as: 'network',
                foreignKey: 'network_id'
            });
            Transaction.hasMany(models.Item, {
                as: 'items',
                foreignKey: 'transaction_id',
                allowNull: false
            });
		}
	}
	Transaction.init({
        transaction_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date: DataTypes.DATE,
        sender_id: DataTypes.INTEGER,
        network_id: DataTypes.INTEGER,
        receiver_id: DataTypes.INTEGER,
        resolution_date: DataTypes.DATE,
	}, {
        hooks: {
            afterCreate: (transaction, options) => {
                /**
                 * TODO: refactor usage of hook
                 * TODO: transfer email creation and sending to some file
                 * should be a new model to also cater notification
                 * TODO: change 'to' email to the email of the sender
                 * email is sent to my account for testing purposes
                 */
                try {
                    const sgMail = require('@sendgrid/mail');
                    const dotenv = require('dotenv');
                    dotenv.config();
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    let message = {
                        to: 'social.caesar.patac@gmail.com',
                        from: 'utang.application@gmail.com',
                        subject: transaction.transaction_name,
                        html: '<p>You have a new transaction. Please check UtAp notifications.</p>',
                    };
                    sgMail.send(message).then(() => {
                        console.log('Success!')
                    }, error => {
                        console.error(error);
                        if (error.response) {
                            console.error(error.response.body);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        },
		sequelize,
		modelName: 'Transaction',
	});
	return Transaction;
};
