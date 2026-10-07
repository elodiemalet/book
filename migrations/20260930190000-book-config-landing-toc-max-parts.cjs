'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('BookConfigs', 'landingTocMaxParts', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 6,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('BookConfigs', 'landingTocMaxParts');
    }
};
