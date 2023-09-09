import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MYSQL_DATABASE);

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
});

sequelize
    .authenticate()
    .then(() => {
    console.log("Conexão OK");
})
    .catch((error) => {
        console.error("Falha:", error);
    });

const Sensor = sequelize.define("Sensor", {
    wea_temp: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    wea_humid: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

export { sequelize, Sensor };
