'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Networks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            network_name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            is_active: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
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

        await queryInterface.createTable('UserNetworks', {
            // User belongsToMany Network
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            network_id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserNetworks');
        await queryInterface.dropTable('Networks');
    }
};
