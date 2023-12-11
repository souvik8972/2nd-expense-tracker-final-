const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Order=sequelize.define("order",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    payment_id:Sequelize.STRING,
    order_id:Sequelize.STRING,
    status:Sequelize.STRING
})

module.exports=Order