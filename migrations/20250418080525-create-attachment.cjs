'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Attachments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.ENUM('image', 'pdf')
            },
            pageType: {
                type: Sequelize.ENUM('cover', 'title', 'copyright', 'dedication_page', 'table_of_contents', 'preface_introduction', 'chapters', 'interlude_boxed_section', 'appendices', 'author_notes', 'index', 'acknowledgments_page', 'publisher_page', 'advertisements_other_books', 'back_cover')
            },
            size: {
                type: Sequelize.INTEGER
            },
            url: {
                type: Sequelize.STRING
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Attachments');
    }
};
