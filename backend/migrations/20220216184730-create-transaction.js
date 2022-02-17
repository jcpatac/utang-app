'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            amount: {
                allowNull: false,
                defaultValue: 0.0,
                type: Sequelize.DECIMAL
            },
            date: {
                allowNull: true,
                type: Sequelize.DATE
            },
            is_resolved: {
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            resolution_date: {
                allowNull: true,
                type: Sequelize.DATE
            }
,            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down (queryInterface, Sequelize) {
         await queryInterface.dropTable('Transactions');
    }
};
