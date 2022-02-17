'use strict';

/**
 * Transaction Model
 * Represents a Transaction object
 * Fields:
 * 		- amount	        --- the amount of transaction
 * 		- date		        --- the date of the transaction
 * 		- is_resolved	    --- if the transaction is resolved or not
 * 		- resolution_date	--- the date of resolution
 * 
 * Associations:
 *      - sender            --- the User sending the payment
 *      - receiver          --- the User receiving the payment
 */

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
            Transaction.belongsTo(models.User, {
                as: 'sender',
                foreignKey: 'user_id'
            });
            Transaction.belongsTo(models.User, {
                as: 'receiver',
                foreignKey: 'user_id'
            });
            Transaction.belongsTo(models.Network, {
                as: 'network_group',
                foreignKey: 'network_id'
            });
		}
	}
	Transaction.init({
		amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.0
        },
		date: DataTypes.DATE,
		is_resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        resolution_date: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'Transaction',
	});
	return Transaction;
};