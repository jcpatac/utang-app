'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * User Model
		 * Represents a User object
		 * Fields:
		 * 		- first_name				--- the first name of the user
		 * 		- last_name					--- the last name of the user
		 * 		- email						--- the email of the user
		 * 		- password					--- the password of the user
		 * 		- is_active					--- determines if user is active
		 * 
		 * Associations:
		 * 		- transactions_as_sender	--- transaction as sender
		 * 		- transactions_as_receiver	--- transaction as receiver
		 * 		- user_networks				--- the networks of a user
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Transaction, {
				as: 'transactions',
				foreignKey: 'sender_id',
				foreignKey: 'receiver_id'
			});
			// User.hasMany(models.Transaction, {
			// 	as: 'transactions',
			// 	foreignKey: 'receiver_id'
			// });
			User.belongsToMany(models.Network, {
				as: 'networks',
				through: 'UserNetworks',
				foreignKey: 'user_id'
			});
		}
	}
	User.init({
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};
