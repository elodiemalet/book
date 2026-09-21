'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Posts', 'externalId', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        // unique
        await queryInterface.addConstraint('Posts', {
            type: 'unique',
            name: 'unique_external_id',
            fields: ['externalId']
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('Posts', 'externalId');
    }
};
