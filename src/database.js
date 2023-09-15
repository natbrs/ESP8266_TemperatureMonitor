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
        console.log('Conexão estável');
    })
    .catch((error) => {
        console.error('Falha:', error);
    });

const Weather = sequelize.define('weather', {
    wea_temp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wea_humid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export { sequelize, Weather };