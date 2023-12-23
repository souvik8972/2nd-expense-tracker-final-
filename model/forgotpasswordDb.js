const Sequelize=require("sequelize")
const sequelize=require("../util/db")


const ForgotPassword = sequelize.define('forgotpassword',{

id:{
    type:Sequelize.UUID,
    
    autoincrement:true,
    allowNull:true,
    primaryKey:true,
    defaultValue: Sequelize.UUIDV4
   
},
isActive:{
    type:Sequelize.BOOLEAN,
   
}

})

module.exports=ForgotPassword