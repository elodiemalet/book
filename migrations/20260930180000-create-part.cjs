'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Parts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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
        // Supprimer une partie ne supprime pas ses textes : ils redeviennent « sans partie »
        await queryInterface.addColumn('Posts', 'partId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {model: 'Parts', key: 'id'},
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('Posts', 'partId');
        await queryInterface.dropTable('Parts');
    }
};
