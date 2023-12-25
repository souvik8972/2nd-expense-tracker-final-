const Sequelize = require('sequelize');
require("dotenv").config()
const DB_NAME=process.env.DB_NAME
const DB_PASSWORD=process.env.DB_PASSWORD
const DB_USER=process.env.DB_USER
const DB_HOST_NAME=process.env.DB_HOST_NAME

const sequelize = new Sequelize(DB_NAME,DB_USER,DB_PASSWORD,{
    dialect:'mysql',
    host:DB_HOST_NAME,
    logging:false
});
module.exports = sequelize;