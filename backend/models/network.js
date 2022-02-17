'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Network extends Model {
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