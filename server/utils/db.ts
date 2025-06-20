import {type Dialect, Sequelize} from 'sequelize';
import configJson from '../../config/config.json';

type Environments = 'development' | 'test' | 'production';
const env = (process.env.NODE_ENV as Environments) || 'development';

interface DBSettings {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
}

interface DBConfig {
    [key: string]: DBSettings;
}

const config: DBConfig = configJson as unknown as DBConfig;

// if env is not in, type Environments return
if (config[env] === undefined) {
    console.warn(`[WARN] No config for env ${env} found, using development config`);
}

const {username, password, database, host, dialect} = config[env] || config.development;

const sequelize: Sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect: dialect as Dialect,
        port: 5432
    },
);

export default {
    sequelize,
};
