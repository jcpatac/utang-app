'use strict';

/**
 * User Model
 * Represents a User object
 * Fields:
 * 		- first_name		--- the first name of the user
 * 		- last_name			--- the last name of the user
 * 		- email				--- the email of the user
 * 		- password			--- the password of the user
 * 		- is_active			--- determines if user is active
 * 
 * Associations:
 * 		- user_transactions	--- the transactions of a user
 * 		- user_networks		--- the networks of a user
 */

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Transaction, {
				as: 'user_transactions',
				foreignKey: 'user_id'
			});
			User.belongsToMany(models.Network, {
				as: 'user_networks',
				through: 'UserNetwork',
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

/**
 * Network Model
 * Represents the Networks of a User
 * Fields:
 * 		- network_name			--- the name of the network
 * 		- is_active				--- determines if network is active
 * 
 * Associations:
 * 		- members				--- the members of the network
 * 		- network_transactions	--- the transactions of a network
 */

module.exports = (sequelize, DataTypes) => {
	class Network extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Network.belongsToMany(models.User, {
				as: 'members',
				through: 'UserNetwork',
				foreignKey: 'network_id'
			});
			Network.hasMany(models.Transaction, {
				as: 'network_transactions',
				foreignKey: 'network_id'
			});
		}
	}
	Network.init({
		network_name: {
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
		modelName: 'Network',
	});
	return Network;
};
