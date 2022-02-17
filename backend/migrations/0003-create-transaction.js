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
            transaction_name: {
                allowNull: false,
                type: Sequelize.STRING
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
            // Transaction belongsTo User
            'Transactions',
            'sender_id',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        );

        await queryInterface.addColumn(
            // Transaction belongsTo User
            'Transactions',
            'receiver_id',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        );

        await queryInterface.addColumn(
            // Transaction belongsTo Network
            'Transactions',
            'network_id',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Networks',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        );
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            'Transactions',
            'network_id'
        );
        await queryInterface.removeColumn(
            'Transactions',
            'receiver_id'
        );
        await queryInterface.removeColumn(
            'Transactions',
            'sender_id'
        );
        await queryInterface.dropTable('Transactions');
    }
};
