import {Model, DataTypes} from 'sequelize';
import db from "~/server/utils/db";

// Une partie du livre (« I — Commencer »). Les textes s'y rattachent par Post.partId.
export interface PartInterface {
    id: number;
    title: string;
    // Ordre des parties dans le livre (croissant)
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

export default class Part extends Model {
    // `declare` et non `public …!` : un vrai champ de classe masquerait les accesseurs de Sequelize
    declare id: number;
    declare title: string;
    declare position: number;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Part.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {notEmpty: true},
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'Parts',
        sequelize: db.sequelize,
    }
);
