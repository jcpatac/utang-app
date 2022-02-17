'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            // User hasMany Transaction
            'Transactions',
            'user_transactions',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        );

        await queryInterface.addColumn(
            // Transaction belongsTo User
            'Transactions',
            'sender',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        );

        await queryInterface.addColumn(
            // Transaction belongsTo User
            'Transactions',
            'receiver',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        );
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            'Transactions',
            'user_transactions'
        );

        await queryInterface.removeColumn(
            'Transactions',
            'sender'
        );

        await queryInterface.removeColumn(
            'Transactions',
            'reciever'
        );
    }
};
