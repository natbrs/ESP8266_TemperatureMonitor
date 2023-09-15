import { Sequelize, DataTypes } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv/config.js';

console.log(process.env.POSTGRES_DATABASE)

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Conexão OK');
    })
    .catch((error) => {
        console.error('Falha:', error);
    });

const Weather = sequelize.define('weather', {
    wea_temp: {
        type: DataTypes.FLOAT,
    },
    wea_humid: {
        type: DataTypes.FLOAT,
    },
});

export { sequelize, Weather };