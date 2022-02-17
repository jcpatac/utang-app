'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
        /**
         * Item Model
         * Represents an Item object
         * Fields:
         *      - item_name             --- the name of the transaction
         * 		- amount    	        --- the amount of transaction
         *      - transaction_id        --- Transaction FK
         * 
         * Associations:
         *      - transaction           --- Transaction that the Item belongs
         */
        static associate(models) {
            // define association here
            Item.belongsTo(models.Transaction, {
                as: 'transaction',
                foreignKey: 'transaction_id'
            });
        }
    }
    Item.init({
        item_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.0
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Item',
    });
    return Item;
};
