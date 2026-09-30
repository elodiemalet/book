'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SiteConfigs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            // Contenu éditorial de la page d'accueil (auteur, accroche, offres…), fusionné avec les valeurs par défaut.
            content: {
                type: Sequelize.JSONB,
                allowNull: false,
                defaultValue: {}
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
    },

    async down(queryInterface) {
        await queryInterface.dropTable('SiteConfigs');
    }
};
