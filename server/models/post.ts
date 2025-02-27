import {Model, DataTypes, type Sequelize} from 'sequelize';
import db from "~/server/utils/db";

export default class Post extends Model {
    public id!: number;
    public postTitle!: string;
    public author!: string;
    public content!: string;
    public attachments!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        postTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        attachments: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'Posts',
        sequelize: db.sequelize,
    }
);
