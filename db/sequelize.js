var Sequelize = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.database_name, process.env.database_user, process.env.database_password, {
    logging: false,
    host: process.env.host,
    dialect: 'mysql',
    port:3306,
    pool: {
        max: 10,
        min: 1,
        idle: 10000
    }
});