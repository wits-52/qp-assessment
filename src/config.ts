import { AppConfig } from './app/constant/types';

const config: AppConfig = {
    PORT: process.env.PORT || '3000',
    DB_PORT: parseInt(process.env.DB_PORT || '5432'),
    DB_USER: process.env.DB_USER || 'user',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_DBNAME: process.env.DB_DBNAME || 'postgres',
    JWT_SECRET: process.env.JWT_SECRET

}

export default config;