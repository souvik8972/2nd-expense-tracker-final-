
const express = require("express");
const route = express.Router();

const UserDb=require("../model/userDb")
const ExpenseDb=require("../model/expenseDb")
const authController= require("../middleware/authentication")



route.get("/leaderboard", async (req,res)=>{
    try {
        const Users=await UserDb.findAll()
        const expenses=await ExpenseDb.findAll()
        let sepUserandmakeKeyValue={}
      expenses.forEach((expense)=>{
        if(sepUserandmakeKeyValue[expense.UserId]){
            sepUserandmakeKeyValue[expense.UserId]+=expense.amount
            console.log(sepUserandmakeKeyValue,expense.UserId)
        }else{
            sepUserandmakeKeyValue[expense.UserId]=expense.amount 
        }
      })
      let UserDetails=[]
      Users.forEach((user)=>{
        UserDetails.push({name:user.name,total_spent:sepUserandmakeKeyValue[user.id]})

      })

 res.status(200).json(UserDetails)
    } catch (error) {
        res.json({error: error})
    }
})




module.exports=route