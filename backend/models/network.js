'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Network extends Model {
		/**
		 * Network Model
		 * Represents the Networks of Users
		 * Fields:
		 * 		- network_name	--- the name of the network
		 * 		- is_active		--- determines if network is active
		 * 
		 * Associations:
		 * 		- users			--- the members of the network
		 * 		- transactions	--- the transactions of a network
		 */
		static associate(models) {
			// define association here
			Network.belongsToMany(models.User, {
				as: 'users',
				through: 'UserNetworks',
				foreignKey: 'network_id'
			});
			Network.hasMany(models.Transaction, {
				as: 'transactions',
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
