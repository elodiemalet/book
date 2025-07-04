'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
            INSERT INTO "Users"
            ("name", "email", "password", "emailVerified", "role", "active", "createdAt", "updatedAt")
            VALUES ('Admin',
                    'admin@admin.com',
                    '$scrypt$n=16384,r=8,p=1$vTXHwMqvSo4ZrnE6ODvdVw$RRfbQPB56mZlappZwZTDG85AEf6t1BoSTWo0sWQW05nzQZrHmYuAmQECIoksTRODDcC2gLo7+7y336vDSPsCAQ',
                    true,
                    'admin',
                    true,
                    now(), now());
        `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
            DELETE
            FROM "Users"
            WHERE "email" = 'admin@admin.com';
        `);
    }
};
