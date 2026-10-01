'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('BookConfigs', 'showToc', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
        await queryInterface.addColumn('BookConfigs', 'tocPosition', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'start',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('BookConfigs', 'tocPosition');
        await queryInterface.removeColumn('BookConfigs', 'showToc');
    }
};
