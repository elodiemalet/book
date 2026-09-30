import {Model, DataTypes} from 'sequelize';
import db from "~/server/utils/db";

export default class SiteConfig extends Model {
    public id!: number;
    public content!: Record<string, unknown>;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SiteConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    },
    {
        tableName: 'SiteConfigs',
        sequelize: db.sequelize,
    }
);
