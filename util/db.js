const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense_tracker1','root','712123@daS',{
    dialect:'mysql',
    host:'localhost',
    logging:false
});
module.exports = sequelize;