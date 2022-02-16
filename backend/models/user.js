'use strict';

/**
 * User Model
 * Represents a User object
 * Fields:
 * 		- first_name	--- the first name of the user
 * 		- last_name		--- the last name of the user
 * 		- email			--- the email of the user
 * 		- password		--- the password of the user
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
		}
	}
	User.init({
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};