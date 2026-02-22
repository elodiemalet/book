'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('BookConfigs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true
            },
            author: {
                type: Sequelize.STRING,
                allowNull: true
            },
            years: {
                type: Sequelize.STRING,
                allowNull: true
            },
            dedicationText: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            dedicationAuthor: {
                type: Sequelize.STRING,
                allowNull: true
            },
            prefaceText: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            pageFormat: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'a4'
            },
            maxLines: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 38
            },
            maxLinesFirstPage: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 32
            },
            pageStart: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 6
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

        // Seed with default values from the current hardcoded config
        await queryInterface.bulkInsert('BookConfigs', [{
            id: 1,
            title: 'Recueil de Poèmes',
            author: '',
            years: '2019 - 2024',
            dedicationText: '',
            dedicationAuthor: '',
            prefaceText: '',
            pageFormat: 'a4',
            maxLines: 38,
            maxLinesFirstPage: 32,
            pageStart: 6,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('BookConfigs');
    }
};
