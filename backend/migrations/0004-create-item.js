'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            item_name: {
                type: Sequelize.STRING
            },
            amount: {
                allowNull: false,
                defaultValue: 0.0,
                type: Sequelize.DECIMAL
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addColumn(
            // Item belongsTo Transaction
            'Items',
            'transaction_id',
            {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Transactions',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        )
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            'Items',
            'transaction_id'
        );
        await queryInterface.dropTable('Items');
    }
};
