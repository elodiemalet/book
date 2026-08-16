import {type Dialect, Sequelize} from 'sequelize';

type Environments = 'development' | 'test' | 'production';
const env = (process.env.NODE_ENV as Environments) || 'development';

// Defaults only cover local dev/test (matching docker-compose service names);
// production must be fully configured via DB_* env vars.
const DEFAULTS: Record<Environments, { host: string; database: string; username: string }> = {
    development: {host: 'postgres', database: 'livre', username: 'user'},
    test: {host: 'postgres', database: 'database_test', username: 'user'},
    production: {host: '', database: '', username: ''},
};
const defaults = DEFAULTS[env] || DEFAULTS.development;

const sequelize: Sequelize = new Sequelize(
    process.env.DB_NAME || defaults.database,
    process.env.DB_USER || defaults.username,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || defaults.host,
        dialect: 'postgres' as Dialect,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        logging: false,
        benchmark: false,
    },
);

export default {
    sequelize,
};
