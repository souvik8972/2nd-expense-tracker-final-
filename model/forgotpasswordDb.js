const Sequelize=require("sequelize")
const sequelize=require("../util/db")



const ForgotPassword = sequelize.define('forgotpassword',{

id:{
    type:Sequelize.INTEGER,
    autoincrement:true,
    allowNull:true,
    primaryKey:true
},
isActive:{
    type:Sequelize.BOOLEAN,
   
}

})

module.exports=ForgotPassword