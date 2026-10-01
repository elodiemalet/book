import {Model, DataTypes} from 'sequelize';
import db from "~/server/utils/db";

export default class SiteConfig extends Model {
    // `declare` et non `public …!` : un vrai champ de classe masquerait les accesseurs de Sequelize
    // (instance.content vaudrait toujours undefined).
    declare id: number;
    declare content: Record<string, unknown>;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
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
