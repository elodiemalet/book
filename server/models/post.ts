import {Model, DataTypes} from 'sequelize';
import db from "~/server/utils/db";

import * as Yup from "yup";

export interface PostInterface {
    id: number;
    postTitle: string;
    author: string;
    content: string;
    attachments: string;
    externalId: string;
    publishDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export function getPostSchemaValidator() {
    return Yup.object().shape({
        postTitle: Yup.string().required('Post title is required'),
        author: Yup.string().required('Author is required'),
        content: Yup.string().required('Content is required'),
    });
}

export default class Post extends Model {
    public id!: number;
    public postTitle!: string;
    public author!: string;
    public content!: string;
    public attachments!: string;
    public externalId!: string;
    public publishDate!: Date;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
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
        externalId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        publishDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'Posts',
        sequelize: db.sequelize,
    }
);
