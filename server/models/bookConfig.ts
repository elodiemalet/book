import {Model, DataTypes} from 'sequelize';
import db from "~/server/utils/db";

export interface BookConfigInterface {
    id: number;
    title: string;
    author: string;
    years: string;
    dedicationText: string;
    dedicationAuthor: string;
    prefaceText: string;
    pageFormat: string;
    maxLines: number;
    maxLinesFirstPage: number;
    pageStart: number;
    createdAt: Date;
    updatedAt: Date;
}

export default class BookConfig extends Model {
    public id!: number;
    public title!: string;
    public author!: string;
    public years!: string;
    public dedicationText!: string;
    public dedicationAuthor!: string;
    public prefaceText!: string;
    public pageFormat!: string;
    public maxLines!: number;
    public maxLinesFirstPage!: number;
    public pageStart!: number;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

BookConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        years: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dedicationText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dedicationAuthor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prefaceText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pageFormat: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'a4',
        },
        maxLines: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 38,
        },
        maxLinesFirstPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 32,
        },
        pageStart: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 6,
        },
    },
    {
        tableName: 'BookConfigs',
        sequelize: db.sequelize,
    }
);
