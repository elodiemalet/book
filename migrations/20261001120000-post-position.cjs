'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Ordre des textes dans leur partie. 0 partout : l'ordre reste celui de la création, du plus récent au plus ancien.
        await queryInterface.addColumn('Posts', 'position', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('Posts', 'position');
    }
};
